import datetime
import random
from typing import Iterable, Optional, Tuple, List

from django.db import transaction

from contests.models import Contest, Language, User, Permission
from contests.exceptions import NoSuchContestError, \
    NoSuchLanguageError, \
    ForbiddenActionError, \
    UserAlreadyInvitedError
from contests.auth.core import get_all_permissions, get_user_by_id


def get_all_languages() -> Iterable[Language]:
    return Language.objects.all()


def get_language_by_id(lang_id: int) -> Language:
    try:
        return Language.objects.get(pk=lang_id)
    except Language.DoesNotExist:
        raise NoSuchLanguageError()


def get_all_contests() -> Iterable[Contest]:
    return Contest.objects.all()


def get_contest_by_id(contest_id: int) -> Contest:
    try:
        return Contest.objects.get(pk=contest_id)
    except Contest.DoesNotExist:
        raise NoSuchContestError()


def get_contest_by_short_id(short_id: str) -> Contest:
    try:
        return Contest.objects.get(short_id=short_id)
    except Contest.DoesNotExist:
        raise NoSuchContestError()


@transaction.atomic
def create_contest(email: str,
                   name: str,
                   short_id: str,
                   short_description: str,
                   description: str = 'Just another competitive programming competition',
                   start_time: Optional[datetime.datetime] = None,
                   finish_time: Optional[datetime.datetime] = None,
                   freezed: bool = False,
                   grading_size: int = 1) -> Tuple[Contest, User]:

    if start_time is None and finish_time is None:
        start_time = datetime.datetime.now() + datetime.timedelta(days=10)
        finish_time = start_time + datetime.timedelta(hours=5)
    if finish_time is not None:
        start_time = finish_time - datetime.timedelta(hours=5)
    if start_time is not None:
        start_time = start_time + datetime.timedelta(hours=5)

    new_contest = Contest(name=name,
                          short_id=short_id,
                          short_description=short_description,
                          description=description,
                          start_time=start_time,
                          finish_time=finish_time,
                          freezed=freezed,
                          grading_size=grading_size)

    new_contest.full_clean()
    new_contest.save()
    languages = get_all_languages()
    new_contest.permitted_languages.add(*languages)

    signup_otc = "".join([random.choice("0123456789") for _ in range(8)])
    new_user = User(email=email,
                    contest=new_contest,
                    signup_otc=signup_otc)
    new_user.full_clean()
    new_user.save()
    permissions = get_all_permissions()
    new_user.permissions.add(*permissions)

    return new_contest, new_user


@transaction.atomic
def update_contest(user: User,
                   name: Optional[str],
                   short_description: Optional[str],
                   description: Optional[str],
                   start_time: Optional[datetime.datetime],
                   finish_time: Optional[datetime.datetime],
                   freezed: Optional[bool],
                   grading_size: Optional[int],
                   permitted_languages: Optional[Iterable[str]]) -> Contest:
    if not user.has_permission('update:contest'):
        raise ForbiddenActionError(
            "You Don't Have Permission To Update Contest")

    updating_contest = user.contest
    if name is not None:
        updating_contest.name = name
    if short_description is not None:
        updating_contest.short_description = short_description
    if description is not None:
        updating_contest.description = description
    if start_time is not None:
        updating_contest.start_time = start_time
    if finish_time is not None:
        updating_contest.finish_time = finish_time
    if freezed is not None:
        updating_contest.freezed = freezed
    if grading_size is not None:
        updating_contest.grading_size = grading_size
    updating_contest.save()

    if permitted_languages is not None:
        langs = Language.objects.filter(id__in=permitted_languages)
        updating_contest.permitted_languages.set(langs)
        updating_contest.save()

    return updating_contest


@transaction.atomic
def invite_users(user: User, emails: List[str], permissions: List[str]) -> Iterable[User]:
    if not user.has_permission('invite:users'):
        raise ForbiddenActionError("You Don't Have Permission To Invite Users")

    my_permissions = user.permission_codes
    for perm in permissions:
        if perm not in my_permissions:
            raise ForbiddenActionError(
                "You Don't Have Permission To Give Permission \"{}\"".format(perm))

    current_users = User.objects.filter(
        contest__id=user.contest.id, email__in=emails).count()
    if current_users > 0:
        raise UserAlreadyInvitedError("Some User Already Invited")

    permissions = Permission.objects.filter(code__in=permissions)
    new_users: List[User] = []
    for email in emails:
        signup_otc = "".join([random.choice("0123456789")
                              for _ in range(8)])
        new_user = User(email=email,
                        contest=user.contest,
                        signup_otc=signup_otc)
        new_user.full_clean()
        new_user.save()
        new_user.permissions.add(*permissions)
        new_users += [new_user]
    return new_users


def update_permissions(issuer: User, user_id: int, permissions: List[str]) -> User:
    if not issuer.has_permission('update:usersPermissions'):
        raise ForbiddenActionError(
            "You Dont't Have Permission To Update User's Permissions")

    user = get_user_by_id(user_id)
    if user.contest != issuer.contest:
        raise ForbiddenActionError(
            "You Dont't Have Permission To Update This User's Permissions")

    updating_permissions: List[str] = []
    old_permissions = user.permission_codes
    new_permissions = permissions
    for perm in old_permissions:
        if perm not in new_permissions:
            updating_permissions += [perm]
    for perm in new_permissions:
        if perm not in old_permissions:
            updating_permissions += [perm]

    issuer_permissions = issuer.permission_codes
    for perm in updating_permissions:
        if perm not in issuer_permissions:
            raise ForbiddenActionError(
                "You Don't Have Permission To Update User's {}".format(perm))

    user.set_permissions(Permission.objects.filter(code__in=permissions))
    user.save()
    return user
