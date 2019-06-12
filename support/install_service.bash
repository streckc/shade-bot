#!/bin/bash

USER="pi"
# Note Debian/Ubuntu uses 'nogroup', RHEL/Fedora uses 'nobody'
GROUP="nogroup"

SERVICE_PATH="/etc/systemd/system"
SERVICE_FILE="shade-bot.service"
SERVICE_NAME="$(echo $SERVICE_FILE | cut -f1 -d.)"
INSTALL_PATH="$(cd $(dirname $0) && pwd)"
RUN_PATH="$(dirname $INSTALL_PATH)"

TMP="/tmp/$$.install"

if [ ! -d "$RUN_PATH" ]; then
  echo "ERROR: Run path not found."
  exit 1
elif [ ! -f "$RUN_PATH/bot.js" ]; then
  echo "ERROR: Bot executable is not found. ($RUN_PATH/bot.js)"
  exit 2
fi

if [ ! -f "$INSTALL_PATH/$SERVICE_FILE" ]; then
  echo "ERROR: Can not find service template."
  exit 3
fi

if [ ! -d "$SERVICE_PATH" ]; then
  echo "ERROR: Service path not found.  Is this not systemd?"
  exit 4
elif [ -f "$SERVICE_PATH/$SERVICE_FILE" -a "X$1" != "X-f" ]; then
  echo "ERROR: Service already installed"
  exit 5
fi

sed -e "s#__INSTALL_DIR__#$RUN_PATH#g" "$INSTALL_PATH/$SERVICE_FILE" > "$TMP"
sed -e "s#__USER__#$NODE_USER#g" "$TMP" > "$TMP"
sed -e "s#__GROUP__#$NODE_GROUP#g" "$TMP" > "$TMP"

mv "$TMP" "$SERVICE_PATH/$SERVICE_FILE"

systemctl enable $SERVICE_NAME
systemctl start $SERVICE_NAME

