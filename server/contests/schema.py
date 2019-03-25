from random import choice
from datetime import datetime, timedelta
from django.db import transaction
from graphene import Field, String, List, Mutation, ObjectType, InputObjectType
from graphene.types.datetime import DateTime
from graphene_django.types import DjangoObjectType
from contests.models import User, Contest, Language


class UserType(DjangoObjectType):
    permissions = List(String)

    @staticmethod
    def resolve_permissions(root, _):
        return map(lambda perm: perm.code, root.permissions.all())

    class Meta:
        model = User
        only_fields = ('id', 'name', 'username', 'email', 'contest')


class ContestType(DjangoObjectType):
    user_by_email = Field(UserType, email=String())
    user_by_username = Field(UserType, username=String())

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


class ContestInput(InputObjectType):
    name = String(required=True)
    short_id = String(required=True)
    short_description = String(required=True)


class CreateContest(Mutation):
    class Arguments:
        email = String(required=True)
        contest = ContestInput(required=True)

    contest = Field(ContestType)
    admin = Field(UserType)

    @staticmethod
    @transaction.atomic
    def mutate(root, info, contest, email):
        start_time = datetime.now() + timedelta(days=10)
        finish_time = datetime.now() + timedelta(days=10, hours=5)
        description = 'Just another competitive programming competition'

        new_contest = Contest(**contest, start_time=start_time, description=description,
                              finish_time=finish_time, freezed=False)
        new_contest.full_clean()
        new_contest.save()

        signup_otc = "".join([choice("0123456789") for _ in range(8)])
        new_user = User(email=email, contest=new_contest,
                        signup_otc=signup_otc)
        new_user.full_clean()
        new_user.save()

        return CreateContest(contest=new_contest, admin=new_user)


class LanguageType(DjangoObjectType):
    extensions = List(String)

    @staticmethod
    def resolve_extensions(root, _):
        return root.extension_list

    class Meta:
        model = Language
        only_fields = ('id', 'name', 'username', 'email', 'contest')


class Query(ObjectType):
    user = Field(UserType, id=String())

    contest = Field(ContestType, id=String())
    contest_by_short_id = Field(ContestType, shortId=String())

    language = Field(LanguageType, id=String(required=True))
    languages = List(LanguageType)

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


class Mutation(ObjectType):
    create_contest = CreateContest.Field()
