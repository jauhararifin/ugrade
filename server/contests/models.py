import os
import random

from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import validate_email, validate_slug, MinLengthValidator, \
    MaxLengthValidator


class Language(models.Model):
    name = models.CharField(max_length=255)
    extensions = models.CharField(max_length=255)

    @property
    def extension_list(self):
        return self.extensions.split(',')

    def __str__(self):
        return self.name


class Contest(models.Model):
    name = models.CharField(max_length=255, validators=[
        MinLengthValidator(4), MaxLengthValidator(255)
    ])
    short_id = models.CharField(max_length=255, unique=True, validators=[
        validate_slug, MinLengthValidator(4), MaxLengthValidator(255)
    ])
    short_description = models.CharField(max_length=255, validators=[
        MinLengthValidator(4), MaxLengthValidator(255)
    ])
    description = models.TextField(validators=[
        MaxLengthValidator(4 * 1024 * 1024)
    ])
    start_time = models.DateTimeField()
    freezed = models.BooleanField()
    finish_time = models.DateTimeField()
    permitted_languages = models.ManyToManyField(Language)

    def clean(self):
        if self.finish_time <= self.start_time:
            raise ValidationError({
                "finish_time": "Contest's finish time should be greater than start time."
            })

    def __str__(self):
        return self.name


class Permission(models.Model):
    code = models.CharField(max_length=32, unique=True)
    description = models.TextField(validators=[MaxLengthValidator(1024)])

    def __str__(self):
        return self.code


class User(models.Model):
    name = models.CharField('name', max_length=255, validators=[
        MinLengthValidator(4), MaxLengthValidator(255)
    ], null=True, default=None, blank=True)
    username = models.CharField('username', max_length=64, validators=[
        validate_slug, MinLengthValidator(4), MaxLengthValidator(64)
    ], null=True, default=None, blank=True)
    email = models.EmailField('email', max_length=255, validators=[
        validate_email, MinLengthValidator(4), MaxLengthValidator(255)
    ])
    permissions = models.ManyToManyField(Permission)
    contest = models.ForeignKey(
        Contest, related_name='members', on_delete=models.CASCADE)

    password = models.CharField(
        max_length=255, null=True, default=None, blank=True)
    signup_otc = models.CharField(
        max_length=32, null=True, default=None, blank=True)
    reset_password_otc = models.CharField(
        max_length=32, null=True, default=None, blank=True)

    class Meta:
        unique_together = [('username', 'contest'), ('email', 'contest')]

    def __str__(self):
        return str(self.name)


def checker_upload_path(instance, filename):
    alphanum = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    random_str = ''.join(random.choice(alphanum) for _ in range(64))
    return os.path.join("{}-{}-{}".format('checker', instance.id, random_str), filename)


def solution_upload_path(instance, filename):
    alphanum = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    random_str = ''.join(random.choice(alphanum) for _ in range(64))
    return os.path.join("{}-{}-{}".format('solution', instance.id, random_str), filename)


def tcgen_upload_path(instance, filename):
    alphanum = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    random_str = ''.join(random.choice(alphanum) for _ in range(64))
    return os.path.join("{}-{}-{}".format('tcgen', instance.id, random_str), filename)


class Problem(models.Model):
    short_id = models.CharField(max_length=255, validators=[
        validate_slug, MinLengthValidator(1), MaxLengthValidator(255)
    ])
    name = models.CharField(max_length=255, validators=[
        MinLengthValidator(1), MaxLengthValidator(255)
    ])
    statement = models.TextField(validators=[
        MaxLengthValidator(4 * 1024 * 1024)
    ])
    contest = models.ForeignKey(
        Contest, related_name='problems', on_delete=models.CASCADE)
    disabled = models.BooleanField()
    order = models.IntegerField()
    time_limit = models.IntegerField()
    tolerance = models.FloatField()
    memory_limit = models.IntegerField()
    output_limit = models.IntegerField()

    checker_source = models.FileField(
        null=True, blank=True, upload_to=checker_upload_path)
    checker_language = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True, related_name='checkers')

    solution_source = models.FileField(
        null=True, blank=True, upload_to=solution_upload_path)
    solution_language = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True, related_name='solutions')

    tcgen_source = models.FileField(
        null=True, blank=True, upload_to=tcgen_upload_path)
    tcgen_language = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True, related_name='tcgen')

    def __str__(self):
        return self.name

    class Meta:
        unique_together = [('short_id', 'contest')]


def submission_upload_path(instance, filename):
    alphanum = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    random_str = ''.join(random.choice(alphanum) for _ in range(64))
    return os.path.join("{}-{}-{}".format('submission', instance.id, random_str), filename)


class Submission(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)

    solution_source = models.FileField(
        null=True, blank=True, upload_to=submission_upload_path)
    solution_language = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True, related_name='submissions')

    issuer = models.ForeignKey(User, on_delete=models.CASCADE)
    issued_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Submission #{}".format(self.id)
