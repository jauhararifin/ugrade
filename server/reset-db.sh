#!/bin/bash

echo "Flush database..."
pipenv run python manage.py flush --noinput

echo "Migrating database..."
pipenv run python manage.py migrate

echo "Loading fixtures..."
pipenv run python manage.py loaddata contests/fixtures/*
rm -rf storages
cp -r storages-fixtures storages