from typing import Iterable

from contests.models import User
from contests.schema import SignIn, UserInput, SignUp
from .core import sign_in, \
    sign_up, \
    forgot_password, \
    reset_password, \
    get_me, \
    get_user_by_username, \
    get_user_by_email, \
    get_user_by_id, \
    get_all_users


def user_permissions_resolver(root: User, _info) -> Iterable[str]:
    return map(lambda perm: perm.code, root.permissions.all())


def sign_in_mutate(_self, _info, contest_id: str, email: str, password: str) -> SignIn:
    user, token = sign_in(contest_id, email, password)
    return SignIn(user=user, token=token)


def sign_up_mutate(_self, _info,
                   contest_id: str,
                   email: str,
                   user: UserInput,
                   signup_code: str) -> SignUp:
    new_user, token = sign_up(
        contest_id, email, user.username, user.name, user.password, signup_code)
    return SignUp(user=new_user, token=token)


def forgot_password_mutate(_self, _info, contest_id: str, email: str) -> User:
    return forgot_password(contest_id, email)


def reset_passwod_mutate(_self, _info,
                         contest_id: str,
                         email: str,
                         reset_password_otc: str,
                         new_password: str) -> User:
    return reset_password(contest_id, email, reset_password_otc, new_password)


def me_resolver(_root, info) -> User:
    return get_me(info.context)


def user_resolver(_root, _info, user_id: str) -> User:
    return get_user_by_id(user_id)


def users_resolver(_root, _info) -> Iterable[User]:
    return get_all_users()


def user_by_username_resolver(_root, _info, contest_id: str, username: str) -> User:
    return get_user_by_username(contest_id, username)


def user_by_email_resolver(_root, _info, contest_id: str, email: str) -> User:
    return get_user_by_email(contest_id, email)
