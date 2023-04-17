#!/bin/sh

# Abort on any error (including if wait-for-it fails).
set -e

/app/scripts/wait-for-it.sh "$D_DB_NAME:$D_DB_PORT" -t 5 -- npx sequelize-cli db:migrate

# Run the main container command.
exec "$@"