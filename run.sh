MRFID_PORT=443

fuser -k $MRFID_PORT/tcp

npm start > $LOG_PATH/log.txt &
