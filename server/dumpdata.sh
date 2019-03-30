#!/bin/bash

pipenv run python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 4