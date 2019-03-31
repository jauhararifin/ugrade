import random
from typing import Tuple, Iterable

import bcrypt
import jwt
from django.conf import settings
from django.http import HttpRequest

from contests.exceptions import NoSuchContestError, \
    NoSuchUserError, \
    AuthenticationError, \
    UserAlreadySignedUpError, \
    UserHaventSignedUpError
from contests.models import User, Contest


def get_all_users() -> Iterable[User]:
    return User.objects.all()


def get_user_by_id(user_id: str) -> User:
    try:
        return User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise NoSuchUserError()


def sign_in(contest_id: str, email: str, password: str) -> Tuple[User, str]:
    try:
        contest = Contest.objects.get(pk=contest_id)
    except Contest.DoesNotExist:
        raise NoSuchContestError()

    try:
        user = User.objects.filter(
            contest__id=contest.id, email=email).first()
        if user is None:
            raise User.DoesNotExist()
    except User.DoesNotExist:
        raise NoSuchUserError('Wrong Email Or Password')

    if user.username is None:
        raise AuthenticationError(
            "You haven't sign up yet, please sign up first")

    password_matched = bcrypt.checkpw(
        bytes(password, 'utf-8'), bytes(user.password, 'utf-8'))
    if not password_matched:
        raise AuthenticationError('Wrong Email Or Password')

    token = jwt.encode({'id': user.id},
                       settings.SECRET_KEY, algorithm='HS256').decode('utf-8')

    return user, token


def sign_up(contest_id: str,
            email: str,
            username: str,
            name: str,
            password: str,
            signup_code: str) -> Tuple[User, str]:
    try:
        contest = Contest.objects.get(pk=contest_id)
    except Contest.DoesNotExist:
        raise NoSuchContestError()

    try:
        new_user = User.objects.filter(
            contest__id=contest.id, email=email).first()
        if new_user is None:
            raise User.DoesNotExist()
    except User.DoesNotExist:
        raise NoSuchUserError()

    if new_user.username is not None:
        raise UserAlreadySignedUpError()

    if new_user.signup_otc != signup_code:
        raise AuthenticationError('Wrong Token')

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


def forgot_password(contest_id: str, email: str) -> User:
    try:
        contest = Contest.objects.get(pk=contest_id)
    except Contest.DoesNotExist:
        raise NoSuchContestError()

    user = User.objects.filter(
        contest__id=contest.id, email=email).first()
    if user is None:
        raise User.DoesNotExist()

    if user.username is None:
        raise UserHaventSignedUpError()

    if user.reset_password_otc is None:
        user.reset_password_otc = ''.join(
            random.choice('0987654321') for _ in range(8))
        user.save()

    return user


def reset_password(contest_id: str, email: str, reset_password_otc: str, new_password: str) -> User:
    try:
        contest = Contest.objects.get(pk=contest_id)
    except Contest.DoesNotExist:
        raise NoSuchContestError()

    user = User.objects.filter(
        contest__id=contest.id, email=email).first()
    if user is None:
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
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise AuthenticationError('Invalid Token')
    except Exception:
        raise AuthenticationError('Invalid Token')


def get_me(request: HttpRequest) -> User:
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if auth_header is None:
        raise AuthenticationError('Missing Token')

    partition = auth_header.split()
    if len(partition) != 2 or partition[0].lower() != 'bearer':
        raise AuthenticationError('Invalid Token')

    token = partition[1]
    return get_user_from_token(token)
