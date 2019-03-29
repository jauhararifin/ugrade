#!/bin/bash

if [ -f db.sqlite3 ]; then
    echo "Moving db.sqlite3 to db.sqlite3.backup..."
    mv db.sqlite3 db.sqlite3.backup
fi

echo "Migrating database..."
pipenv run python manage.py migrate

echo "Loading fixtures..."
pipenv run python manage.py loaddata contests/fixtures/*

echo "Starting server..."
pipenv run python manage.py runserver