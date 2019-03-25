# Generated by Django 2.1.7 on 2019-03-25 15:02

import django.core.validators
from django.db import migrations, models
import re


class Migration(migrations.Migration):

    dependencies = [
        ('contests', '0004_auto_20190325_1457'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='name',
            field=models.CharField(blank=True, default=None, max_length=255, null=True, validators=[django.core.validators.MinLengthValidator(4), django.core.validators.MaxLengthValidator(255)], verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(blank=True, default=None, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='reset_password_otc',
            field=models.CharField(blank=True, default=None, max_length=32, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='signup_otc',
            field=models.CharField(blank=True, default=None, max_length=32, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(blank=True, default=None, max_length=64, null=True, validators=[django.core.validators.RegexValidator(re.compile('^[-a-zA-Z0-9_]+\\Z'), "Enter a valid 'slug' consisting of letters, numbers, underscores or hyphens.", 'invalid'), django.core.validators.MinLengthValidator(4), django.core.validators.MaxLengthValidator(64)], verbose_name='username'),
        ),
    ]
