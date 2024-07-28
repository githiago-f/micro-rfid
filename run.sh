MRFID_PORT=443
export MRFID_PORT=$MRFID_PORT

fuser -k $MRFID_PORT/tcp

LOG_PATH=./.logs/$(date +"%Y/%m/%d")

mkdir -p $LOG_PATH

npm start > $LOG_PATH/log.txt &
