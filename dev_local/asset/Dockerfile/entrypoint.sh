#!/usr/bin/bash

# =================================
# WEBSSH

if [ \( ${APP_USERNAME} \) -o \( ${AUTH_PASSWORD} \) ]; then
  echo "$APP_USERNAME:$AUTH_PASSWORD" | chpasswd
  echo "[WEBSSH] Username and password updated."
fi

/etc/init.d/ssh start

