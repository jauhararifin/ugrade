import random
import datetime
import bcrypt
import jwt

import graphene
from graphene.types.datetime import DateTime
from graphene_django.types import DjangoObjectType

from django.conf import settings
from django.db import transaction

from contests.models import Contest, Language, User, Permission


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


class ResetPassword(graphene.Mutation):
    class Arguments:
        contest_id = graphene.String(required=True)
        email = graphene.String(required=True)
        reset_password_otc = graphene.String(required=True)
        new_password = graphene.String(required=True)

    Output = UserType

    @staticmethod
    def mutate(_self, _info, contest_id, email, reset_password_otc, new_password):
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
                       'start_time', 'freezed', 'finish_time', 'permitted_languages', 'members')


class ContestInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    short_id = graphene.String(required=True)
    short_description = graphene.String(required=True)
    description = graphene.String(
        default_value='Just another competitive programming competition')
    start_time = DateTime()
    freezed = graphene.Boolean(default_value=False)
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
        if ('start_time' not in contest) and ('finish_time' not in contest):
            contest['start_time'] = datetime.datetime.now() + \
                datetime.timedelta(days=10)
            contest['finish_time'] = contest['start_time'] + \
                datetime.timedelta(hours=5)
        if 'start_time' not in contest:
            contest['start_time'] = contest['finish_time'] - \
                datetime.timedelta(hours=5)
        if 'finish_time' not in contest:
            contest['start_time'] = contest['start_time'] + \
                datetime.timedelta(hours=5)

        new_contest = Contest(**contest)
        new_contest.full_clean()
        new_contest.save()
        new_contest.permitted_languages.add(*Language.objects.all())

        signup_otc = "".join([random.choice("0123456789") for _ in range(8)])
        new_user = User(email=email, contest=new_contest,
                        signup_otc=signup_otc)
        new_user.full_clean()
        new_user.save()
        new_user.permissions.add(*Permission.objects.all())

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
    me = graphene.Field(UserType)

    contest = graphene.Field(ContestType, id=graphene.String())
    contest_by_short_id = graphene.Field(
        ContestType, short_id=graphene.String())

    language = graphene.Field(LanguageType, id=graphene.String(required=True))
    languages = graphene.List(LanguageType)

    clock = DateTime()

    @staticmethod
    def resolve_clock(_root, _info):
        return datetime.datetime.now()

    def resolve_user(self, _, **kwargs):
        try:
            return User.objects.get(pk=kwargs.get('id'))
        except User.DoesNotExist:
            raise ValueError("No Such User")

    def resolve_me(self, info):
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

        return info.context.user

    def resolve_contest(self, _, **kwargs):
        try:
            return Contest.objects.get(pk=kwargs.get('id'))
        except Contest.DoesNotExist:
            raise ValueError("No Such Contest")

    def resolve_contest_by_short_id(self, _, **kwargs):
        try:
            return Contest.objects.get(short_id=kwargs.get('short_id'))
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
    reset_password = ResetPassword.Field()
