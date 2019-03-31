from typing import Iterable

import graphene
from graphene_django.types import DjangoObjectType

from contests.models import User
from .core import sign_in, \
    sign_up, \
    forgot_password, \
    reset_password, \
    get_me, \
    get_user_by_id, \
    get_all_users


class UserType(DjangoObjectType):
    permissions = graphene.List(graphene.String)

    @staticmethod
    def resolve_permissions(root: User, _) -> Iterable[str]:
        return map(lambda perm: perm.code, root.permissions.all())

    class Meta:
        model = User
        only_fields = ('id', 'name', 'username', 'email', 'contest')


class SignIn(graphene.Mutation):
    class Arguments:
        contest_id = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserType)
    token = graphene.Field(graphene.String)

    @staticmethod
    def mutate(_self, _info, contest_id: str, email: str, password: str) -> 'SignIn':
        user, token = sign_in(contest_id, email, password)
        return SignIn(user=user, token=token)


class UserInput(graphene.InputObjectType):
    username = graphene.String(required=True)
    name = graphene.String(required=True)
    password = graphene.String(required=True)


class SignUp(graphene.Mutation):
    class Arguments:
        contest_id = graphene.String(required=True)
        email = graphene.String(required=True)
        user = UserInput(required=True)
        signup_code = graphene.String(required=True)

    user = graphene.Field(UserType)
    token = graphene.Field(graphene.String)

    @staticmethod
    def mutate(_self, _info,
               contest_id: str,
               email: str,
               user: UserInput,
               signup_code: str) -> 'SignUp':
        new_user, token = sign_up(
            contest_id, email, user.username, user.name, user.password, signup_code)
        return SignUp(user=new_user, token=token)


class ForgotPassword(graphene.Mutation):
    class Arguments:
        contest_id = graphene.String(required=True)
        email = graphene.String(required=True)

    Output = UserType

    @staticmethod
    def mutate(_self, _info, contest_id: str, email: str) -> User:
        return forgot_password(contest_id, email)


class ResetPassword(graphene.Mutation):
    class Arguments:
        contest_id = graphene.String(required=True)
        email = graphene.String(required=True)
        reset_password_otc = graphene.String(required=True)
        new_password = graphene.String(required=True)

    Output = UserType

    @staticmethod
    def mutate(_self, _info,
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


class AuthQuery(graphene.ObjectType):
    me = graphene.NonNull(UserType, resolver=me_resolver)
    user = graphene.NonNull(UserType, user_id=graphene.String(
        required=True), resolver=user_resolver)
    users = graphene.NonNull(graphene.List(
        UserType, required=True), resolver=users_resolver)


class AuthMutation(graphene.ObjectType):
    sign_in = SignIn.Field()
    sign_up = SignUp.Field()
    forgot_password = ForgotPassword.Field()
    reset_password = ResetPassword.Field()
