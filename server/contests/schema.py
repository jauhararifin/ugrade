import bcrypt
import jwt
from django.conf import settings
from random import choice
from datetime import datetime, timedelta
from django.db import transaction
import graphene
from graphene.types.datetime import DateTime
from graphene_django.types import DjangoObjectType
from contests.models import User, Contest, Language


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
        try:
            contest = Contest.objects.get(short_id=contest_id)
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
            if not bcrypt.checkpw(bytes(password, "utf-8"), bytes(user.password, "utf-8")):
                raise Exception("Wrong Email Or Password")
        except Exception:
            raise Exception("Internal Server Error")

        token = jwt.encode({'id': user.id},
                           settings.SECRET_KEY, algorithm='HS256').decode("utf-8")
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
        try:
            contest = Contest.objects.get(short_id=contest_id)
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

        new_user.name = user.name
        new_user.username = user.username
        try:
            new_user.password = bcrypt.hashpw(
                bytes(user.password, "utf-8"), bcrypt.gensalt()).decode("utf-8")
        except Exception:
            raise Exception("Internal Server Error")
        new_user.signup_otc = None
        new_user.reset_password_otc = None
        new_user.full_clean()
        new_user.save()

        token = jwt.encode({'id': new_user.id},
                           settings.SECRET_KEY, algorithm='HS256').decode("utf-8")
        return SignUp(user=new_user, token=token)


class ForgotPassword(graphene.Mutation):
    class Arguments:
        contest_id = graphene.String(required=True)
        email = graphene.String(required=True)

    Output = UserType

    @staticmethod
    def mutate(_self, _info, contest_id, email):
        try:
            contest = Contest.objects.get(short_id=contest_id)
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
                choice("0987654321") for _ in range(8))
            user.save()

        return user


class ContestType(DjangoObjectType):
    user_by_email = graphene.Field(UserType, email=graphene.String())
    user_by_username = graphene.Field(UserType, username=graphene.String())

    @staticmethod
    def resolve_user_by_email(root, _, **kwargs):
        try:
            return User.objects.get(contest__id=root.id, email=kwargs.get('email'))
        except User.DoesNotExist:
            raise ValueError("No Such User")

    @staticmethod
    def resolve_user_by_username(root, _, **kwargs):
        try:
            return User.objects.get(
                contest__id=root.id,
                username=kwargs.get('username')
            )
        except User.DoesNotExist:
            raise ValueError("No Such User")

    class Meta:
        model = Contest
        only_fields = ('id', 'name', 'short_id', 'short_description', 'description',
                       'start_time', 'freezed', 'finish_time', 'permitted_languages')


class ContestInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    short_id = graphene.String(required=True)
    short_description = graphene.String(required=True)
    description = graphene.String(
        default_value='Just another competitive programming competition')
    start_time = DateTime()
    finish_time = DateTime()


class CreateContest(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        contest = ContestInput(required=True)

    contest = graphene.Field(ContestType)
    admin = graphene.Field(UserType)

    @staticmethod
    @transaction.atomic
    def mutate(_self, _info, contest, email):
        if 'start_time' not in contest:
            contest['start_time'] = datetime.now() + timedelta(days=10)
        if 'finish_time' not in contest:
            contest['finish_time'] = datetime.now() + \
                timedelta(days=10, hours=5)

        new_contest = Contest(**contest, freezed=False)
        new_contest.full_clean()
        new_contest.save()
        new_contest.permitted_languages.add(*Language.objects.all())

        signup_otc = "".join([choice("0123456789") for _ in range(8)])
        new_user = User(email=email, contest=new_contest,
                        signup_otc=signup_otc)
        new_user.full_clean()
        new_user.save()

        return CreateContest(contest=new_contest, admin=new_user)


class LanguageType(DjangoObjectType):
    extensions = graphene.List(graphene.String)

    @staticmethod
    def resolve_extensions(root, _):
        return root.extension_list

    class Meta:
        model = Language
        only_fields = ('id', 'name', 'username', 'email', 'contest')


class Query(graphene.ObjectType):
    user = graphene.Field(UserType, id=graphene.String())

    contest = graphene.Field(ContestType, id=graphene.String())
    contest_by_short_id = graphene.Field(
        ContestType, shortId=graphene.String())

    language = graphene.Field(LanguageType, id=graphene.String(required=True))
    languages = graphene.List(LanguageType)

    def resolve_user(self, _, **kwargs):
        try:
            return User.objects.get(pk=kwargs.get('id'))
        except User.DoesNotExist:
            raise ValueError("No Such User")

    def resolve_contest(self, _, **kwargs):
        try:
            return Contest.objects.get(pk=kwargs.get('id'))
        except Contest.DoesNotExist:
            raise ValueError("No Such Contest")

    def resolve_contest_by_short_id(self, _, **kwargs):
        try:
            return Contest.objects.get(shortId=kwargs.get('shortId'))
        except Contest.DoesNotExist:
            raise ValueError("No Such Contest")

    def resolve_language(self, _, **kwargs):
        try:
            return Language.objects.get(pk=kwargs.get('id'))
        except Language.DoesNotExist:
            raise ValueError("No Such Language")

    def resolve_languages(self):
        return Language.objects.all()


class Mutation(graphene.ObjectType):
    create_contest = CreateContest.Field()
    sign_in = SignIn.Field()
    sign_up = SignUp.Field()
    forgot_password = ForgotPassword.Field()
