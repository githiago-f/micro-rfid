lsof -n -i :443 | grep LISTEN

npm start > $LOG_PATH/log.txt &
