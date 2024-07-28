cd /home/osboxes/micro-rfid;

# verify if git exists first
if command -v git &> /dev/null; then
  git pull origin main;
fi

ADDR=`ifconfig enp0s3 | grep -Eom1 'inet ([0-9]{1,3}\.){3}[0-9]{1,3}' | cut -d " " -f2`;
CommonName=$ADDR

export ADDRESS=$ADDR

HAS_CAPABILITY=$(getcap `readlink -f \`which node\`` | grep -Eom1 "cap_net_\w*");
if ! [[ "$HAS_CAPABILITY" == "cap_net_bind_service" ]]; then
  echo "Insert the root password to set capability \"cap_net_bind_service\" to node:";
  # allow nodejs to use net bind:
  sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\`` > /dev/null;
else
  echo "Already has capability to use default http/https ports...";
fi

KEY_PATH=./.ssl/key.pem
CERT_PATH=./.ssl/certificate.pem

if (!(test -e $CERT_PATH)); then
  openssl req -x509 -newkey rsa:4096 -nodes -keyout $KEY_PATH -out $CERT_PATH \
    -sha256 -days 3650 -nodes \
    -subj "/C=BR/ST=RioGrandeDoSul/L=PortoAlegre/O=IFRSMicroRFID/OU=TI/CN=$CommonName"

  keytool -delete -cacerts -alias microrfid -storepass $STORE_PASS
  keytool -importcert -cacerts -file $CERT_PATH -alias microrfid -storepass $STORE_PASS

  sudo chmod og+r $KEY_PATH
fi

DB_HOST=localhost
DB_PORT=3306

if (!(test -e .env)); then
  echo "SESSION_SECRET=$SECRET" >> .env
  echo "LOG_LEVEL=INFO" >> .env
  echo "SSL_KEY_PATH=./.ssl/key.pem" >> .env
  echo "SSL_CERT_PATH=./.ssl/certificate.pem" >> .env
  echo "PORT=443" >> .env

  echo "DB_HOST=$DB_HOST" >> .env
  echo "DB_NAME=$DB_NAME" >> .env
  echo "DB_PASSWORD=$DB_PASSWORD" >> .env
  echo "DB_USER=$DB_USER" >> .env
  echo "DB_PORT=$DB_PORT" >> .env
fi

npm install
npm run migrate

LOG_PATH=./.logs/$(date +"%Y/%m/%d")

mkdir -p $LOG_PATH
