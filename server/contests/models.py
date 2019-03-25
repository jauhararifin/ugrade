from django.db import models
from django.core.validators import validate_email, validate_slug, MinLengthValidator, \
    MaxLengthValidator


class Language(models.Model):
    name = models.CharField(max_length=255)
    extensions = models.CharField(max_length=255)

    @property
    def extension_list(self):
        return self.extensions.split(',')


class Contest(models.Model):
    name = models.CharField(max_length=255, validators=[
        MinLengthValidator(4), MaxLengthValidator(255)
    ])
    shortId = models.CharField(max_length=255, unique=True, validators=[
        validate_slug, MinLengthValidator(4), MaxLengthValidator(255)
    ])
    shortDescription = models.CharField(max_length=255, validators=[
        MinLengthValidator(4), MaxLengthValidator(255)
    ])
    description = models.TextField(validators=[
        MaxLengthValidator(4 * 1024 * 1024)
    ])
    startTime = models.DateTimeField()
    freezed = models.BooleanField()
    finishTime = models.DateTimeField()
    permittedLanguages = models.ManyToManyField(Language)


class Permission(models.Model):
    code = models.CharField(max_length=32, unique=True)
    description = models.TextField(validators=[MaxLengthValidator(1024)])


class User(models.Model):
    name = models.CharField('name', max_length=255, validators=[
        MinLengthValidator(4), MaxLengthValidator(255)
    ])
    username = models.CharField('username', max_length=64, validators=[
        validate_slug, MinLengthValidator(4), MaxLengthValidator(64)
    ])
    email = models.EmailField('email', max_length=255, validators=[
        validate_email, MinLengthValidator(4), MaxLengthValidator(255)
    ])
    permissions = models.ManyToManyField(Permission)
    contest = models.ForeignKey(
        Contest, related_name='members', on_delete=models.CASCADE)

    password = models.CharField(max_length=255)
    signup_otc = models.CharField(max_length=32)
    reset_password_otc = models.CharField(max_length=32)

    class Meta:
        unique_together = [('username', 'contest',), ('email', 'contest',)]

    def __str__(self):
        return self.name
