#!/bin/bash
systemctl start docker
node /app/docker-login.js
exec "$@"