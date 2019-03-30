import graphene
from graphene_django.types import DjangoObjectType

from contests.models import User

from .auth import sign_in, sign_up, forgot_password, reset_password


class UserType(DjangoObjectType):
    permissions = graphene.List(graphene.String)

    @staticmethod
    def resolve_permissions(root, _):
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
    def mutate(_self, _info, contest_id, email, password):
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
    def mutate(_self, _info, contest_id, email, user, signup_code):
        new_user, token = sign_up(
            contest_id, email, user.username, user.name, user.password, signup_code)
        return SignUp(user=new_user, token=token)


class ForgotPassword(graphene.Mutation):
    class Arguments:
        contest_id = graphene.String(required=True)
        email = graphene.String(required=True)

    Output = UserType

    @staticmethod
    def mutate(_self, _info, contest_id, email):
        return forgot_password(contest_id, email)


class ResetPassword(graphene.Mutation):
    class Arguments:
        contest_id = graphene.String(required=True)
        email = graphene.String(required=True)
        reset_password_otc = graphene.String(required=True)
        new_password = graphene.String(required=True)

    Output = UserType

    @staticmethod
    def mutate(_self, _info, contest_id, email, reset_password_otc, new_password):
        return reset_password(contest_id, email, reset_password_otc, new_password)
