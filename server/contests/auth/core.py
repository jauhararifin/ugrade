import random
from typing import Tuple, Iterable

import bcrypt
import jwt
from jwt.exceptions import PyJWTError
from django.conf import settings
from django.http import HttpRequest

from contests.exceptions import NoSuchContestError, \
    NoSuchUserError, \
    AuthenticationError, \
    UserAlreadySignedUpError, \
    UserHaventSignedUpError, \
    UsernameAlreadyUsedError
from contests.models import Permission, User, Contest


def _assert_contest_exists(contest_id: int):
    if Contest.objects.filter(pk=contest_id).count() == 0:
        raise NoSuchContestError()


def get_all_permissions() -> Iterable[Permission]:
    return Permission.objects.all()


def get_all_users() -> Iterable[User]:
    return User.objects.all()


def get_user_by_id(user_id: int) -> User:
    try:
        return User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise NoSuchUserError()


def get_user_by_email(contest_id: int, email: str) -> User:
    _assert_contest_exists(contest_id)
    user = User.objects.filter(contest__id=contest_id, email=email).first()
    if user is None:
        raise NoSuchUserError()
    return user


def get_user_by_username(contest_id: int, username: str) -> User:
    _assert_contest_exists(contest_id)
    user = User.objects.filter(
        contest__id=contest_id, username=username).first()
    if user is None:
        raise NoSuchUserError()
    return user


def get_contest_users(contest_id: int) -> Iterable[User]:
    _assert_contest_exists(contest_id)
    return User.objects.filter(contest__id=contest_id).all()


def sign_in(user_id: int, password: str) -> Tuple[User, str]:
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise AuthenticationError('Wrong Credential')

    if user.username is None:
        raise UserHaventSignedUpError(
            "You haven't sign up yet, please sign up first")

    password_matched = bcrypt.checkpw(
        bytes(password, 'utf-8'), bytes(user.password, 'utf-8'))
    if not password_matched:
        raise AuthenticationError('Wrong Credential')

    token = jwt.encode({'id': user.id},
                       settings.SECRET_KEY, algorithm='HS256').decode('utf-8')

    return user, token


def sign_up(user_id: int,
            username: str,
            name: str,
            password: str,
            signup_code: str) -> Tuple[User, str]:
    try:
        new_user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise NoSuchUserError()

    if new_user.username is not None:
        raise UserAlreadySignedUpError()

    if new_user.signup_otc != signup_code:
        raise AuthenticationError('Wrong Token')

    if User.objects.filter(contest__id=new_user.contest.id, username=username).count() > 0:
        raise UsernameAlreadyUsedError()

    new_user.name = name
    new_user.username = username
    new_user.password = bcrypt.hashpw(
        bytes(password, 'utf-8'), bcrypt.gensalt()).decode('utf-8')

    new_user.signup_otc = None
    new_user.reset_password_otc = None
    new_user.full_clean()
    new_user.save()

    token = jwt.encode({'id': new_user.id},
                       settings.SECRET_KEY, algorithm='HS256').decode('utf-8')

    return new_user, token


def forgot_password(user_id: int) -> User:
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise NoSuchUserError()

    if user.username is None:
        raise UserHaventSignedUpError()

    if user.reset_password_otc is None:
        user.reset_password_otc = ''.join(
            random.choice('0987654321') for _ in range(8))
        user.save()

    return user


def reset_password(user_id: int, reset_password_otc: str, new_password: str) -> User:
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise NoSuchUserError()

    if user.username is None:
        raise UserHaventSignedUpError()

    if reset_password_otc != user.reset_password_otc:
        raise AuthenticationError('Wrong Token')

    user.password = bcrypt.hashpw(
        bytes(new_password, 'utf-8'), bcrypt.gensalt()).decode('utf-8')
    user.reset_password_otc = None
    user.save()

    return user


def get_user_from_token(token: str) -> User:
    try:
        data = jwt.decode(token, settings.SECRET_KEY, algorithm=['HS256'])
        user_id = data['id']
        user = User.objects.get(pk=user_id)
    except (PyJWTError, User.DoesNotExist, KeyError, ValueError):
        raise AuthenticationError('Invalid Token')

    # User haven't signed up
    if user.username is None:
        raise AuthenticationError('Invalid Token')
    return user


def get_me(request: HttpRequest) -> User:
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if auth_header is None:
        raise AuthenticationError('Missing Token')

    partition = auth_header.split()
    if len(partition) != 2 or partition[0].lower() != 'bearer':
        raise AuthenticationError('Invalid Token')

    token = partition[1]
    return get_user_from_token(token)
