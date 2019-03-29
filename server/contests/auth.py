import jwt
import bcrypt
import random

from django.conf import settings

from contests.models import User, Contest


def with_me(method):
    def resolve(root, info, *args, **kwargs):
        auth_header = info.context.META.get('HTTP_AUTHORIZATION')
        if auth_header is None:
            raise ValueError("Missing Token")

        partition = auth_header.split()
        if len(partition) != 2 or partition[0].lower() != 'bearer':
            raise ValueError('Invalid Token')

        token = partition[1]
        try:
            data = jwt.decode(token, settings.SECRET_KEY, algorithm=['HS256'])
            user_id = data['id']
            try:
                info.context.user = User.objects.get(pk=user_id)
                if info.context.user is None:
                    raise ValueError("Invalid Token")
            except User.DoesNotExist:
                raise ValueError("Invalid Token")
        except Exception:
            raise ValueError("Invalid Token")
        return method(root, info, *args, **kwargs)
    return resolve


def sign_in(contest_id, email, password):
    try:
        contest = Contest.objects.get(pk=contest_id)
    except Contest.DoesNotExist:
        raise Exception("No Such Contest")

    try:
        user = User.objects.filter(
            contest__id=contest.id, email=email).first()
        if user is None:
            raise User.DoesNotExist()
    except User.DoesNotExist:
        raise Exception("Wrong Email Or Password")

    if user.username is None:
        raise Exception("You haven't sign up yet, please sign up first")

    try:
        password_matched = bcrypt.checkpw(
            bytes(password, "utf-8"), bytes(user.password, "utf-8"))
    except Exception:
        raise Exception("Internal Server Error")
    if not password_matched:
        raise Exception("Wrong Email Or Password")

    token = jwt.encode({'id': user.id},
                       settings.SECRET_KEY, algorithm='HS256').decode("utf-8")

    return (user, token)


def sign_up(contest_id, email, username, name, password, signup_code):
    try:
        contest = Contest.objects.get(pk=contest_id)
    except Contest.DoesNotExist:
        raise Exception("No Such Contest")

    try:
        new_user = User.objects.filter(
            contest__id=contest.id, email=email).first()
        if new_user is None:
            raise User.DoesNotExist()
    except User.DoesNotExist:
        raise Exception("No Such User")

    if new_user.username is not None:
        raise Exception("User Already Signed Up")

    if new_user.signup_otc != signup_code:
        raise Exception("Wrong Token")

    new_user.name = name
    new_user.username = username
    try:
        new_user.password = bcrypt.hashpw(
            bytes(password, "utf-8"), bcrypt.gensalt()).decode("utf-8")
    except Exception:
        raise Exception("Internal Server Error")
    new_user.signup_otc = None
    new_user.reset_password_otc = None
    new_user.full_clean()
    new_user.save()

    token = jwt.encode({'id': new_user.id},
                       settings.SECRET_KEY, algorithm='HS256').decode("utf-8")

    return (new_user, token)


def forgot_password(contest_id, email):
    try:
        contest = Contest.objects.get(pk=contest_id)
    except Contest.DoesNotExist:
        raise Exception("No Such Contest")

    try:
        user = User.objects.filter(
            contest__id=contest.id, email=email).first()
        if user is None:
            raise User.DoesNotExist()
    except User.DoesNotExist:
        raise Exception("No Such User")

    if user.username is None:
        raise Exception("You haven't signed up yet, please sign up first.")

    if user.reset_password_otc is None:
        user.reset_password_otc = "".join(
            random.choice("0987654321") for _ in range(8))
        user.save()

    return user


def reset_password(contest_id, email, reset_password_otc, new_password):
    try:
        contest = Contest.objects.get(pk=contest_id)
    except Contest.DoesNotExist:
        raise Exception("No Such Contest")

    try:
        user = User.objects.filter(
            contest__id=contest.id, email=email).first()
        if user is None:
            raise User.DoesNotExist()
    except User.DoesNotExist:
        raise Exception("No Such User")

    if user.username is None:
        raise Exception("You haven't signed up yet, please sign up first.")

    if reset_password_otc != user.reset_password_otc:
        raise Exception("Wrong Token")

    try:
        user.password = bcrypt.hashpw(
            bytes(new_password, "utf-8"), bcrypt.gensalt()).decode("utf-8")
        user.reset_password_otc = None
    except Exception:
        raise Exception("Internal Server Error")
    user.save()

    return user
