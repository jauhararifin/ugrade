# Generated by Django 2.1.7 on 2019-03-25 13:51

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import re


class Migration(migrations.Migration):

    dependencies = [
        ('contests', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Problem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shortId', models.CharField(max_length=255, unique=True, validators=[django.core.validators.RegexValidator(re.compile('^[-a-zA-Z0-9_]+\\Z'), "Enter a valid 'slug' consisting of letters, numbers, underscores or hyphens.", 'invalid'), django.core.validators.MinLengthValidator(4), django.core.validators.MaxLengthValidator(255)])),
                ('name', models.CharField(max_length=255, validators=[django.core.validators.MinLengthValidator(4), django.core.validators.MaxLengthValidator(255)])),
                ('statement', models.TextField(validators=[django.core.validators.MaxLengthValidator(4194304)])),
                ('disabled', models.BooleanField()),
                ('order', models.IntegerField()),
                ('timeLimit', models.IntegerField()),
                ('tolerance', models.FloatField()),
                ('memoryLimit', models.IntegerField()),
                ('outputLimit', models.IntegerField()),
                ('contest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='problems', to='contests.Contest')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='user',
            unique_together={('email', 'contest'), ('username', 'contest')},
        ),
    ]
