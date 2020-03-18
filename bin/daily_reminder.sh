#!/bin/bash

arg=$1

IFS=, echo $arg | read -r username channel

username=$(echo $arg | cut -d',' -f 1)
channel=$(echo $arg | cut -d',' -f 2)

echo $username
echo $channel

curl -X POST -H "Authorization: Bearer $SLACK_API_TOKEN" \
-H 'Content-type: application/json' \
# curl -X POST -H "Authorization: Bearer $SLACK_API_TOKEN" \
# -H 'Content-type: application/json' \
# --data '{"channel":"'$username'","text":"'$channel'"}' \
# https://slack.com/api/chat.postMessage
