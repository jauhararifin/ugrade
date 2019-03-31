import random
import datetime

import graphene
from graphene.types.datetime import DateTime
from graphene_django.types import DjangoObjectType

from graphene_file_upload.scalars import Upload

from django.db import transaction

from contests.models import Contest, Language, User, Permission, Problem, Submission
from grading.grader import grade_submission
from .auth.decorators import with_me, with_permission
from .auth.schemas import UserType, SignIn, SignUp, ForgotPassword, ResetPassword
from .problem.schemas import ProblemType, ProblemQuery, ProblemMutation


class LanguageType(DjangoObjectType):
    extensions = graphene.List(graphene.String)

    @staticmethod
    def resolve_extensions(root, _info):
        return root.extension_list

    class Meta:
        model = Language
        only_fields = ('id', 'name', 'extensions')


class SubmissionType(DjangoObjectType):
    language = graphene.Field(LanguageType)
    source_code = graphene.Field(graphene.String)

    @staticmethod
    def resolve_language(root, _info):
        return root.solution_language

    @staticmethod
    def resolve_source_code(root, _info):
        return root.source_code.url

    class Meta:
        model = Submission
        only_fields = ('id', 'problem', 'language', 'issued_time', 'issuer')


class ContestType(DjangoObjectType):
    user = graphene.Field(UserType, id=graphene.String())
    user_by_email = graphene.Field(UserType, email=graphene.String())
    user_by_username = graphene.Field(UserType, username=graphene.String())
    problem = graphene.Field(ProblemType, id=graphene.String())
    problems = graphene.List(ProblemType, required=True)
    submissions = graphene.List(SubmissionType)

    @staticmethod
    def resolve_user(root, _, id):
        try:
            user = User.objects.get(pk=id)
            if user.contest.id != root.id:
                raise ValueError("No Such User")
            return user
        except User.DoesNotExist:
            raise ValueError("No Such User")

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

    @staticmethod
    @with_permission('read:problems', "You Don't Have Permission To Read Problems")
    def resolve_problem(root, info, id):
        user = info.context.user
        permissions = user.permissions.filter(
            code__in=['read:problems', 'read:disabledProblems'])
        permissions = map(lambda perm: perm.code, permissions)
        permissions = list(permissions)
        try:
            problem = Problem.objects.get(pk=id)
            if problem.contest.id != root.id:
                raise ValueError("No Such Problem")
            if problem.disabled and 'read:disabledProblems' not in permissions:
                raise ValueError("No Such Problem")
            return problem
        except Problem.DoesNotExist:
            raise ValueError("No Such Problem")
        raise ValueError("Internal Server Error")

    @staticmethod
    @with_permission('read:problems', "You Don't Have Permission To Read Problems")
    def resolve_problems(root, info):
        user = info.context.user
        if user.contest.id != root.id:
            raise ValueError("You Don't Have Permission To Read Problems")
        permissions = user.permissions.filter(
            code__in=['read:problems', 'read:disabledProblems'])
        permissions = map(lambda perm: perm.code, permissions)
        permissions = list(permissions)
        if 'read:problems' not in permissions:
            raise ValueError("You Don't Have Permission To Read Problems")
        query_set = Problem.objects.filter(
            contest__id=user.contest.id).order_by('order')
        if 'read:disabledProblems' not in permissions:
            query_set = query_set.filter(disabled=False)
        return query_set

    @staticmethod
    @with_me
    def resolve_submissions(root, info):
        user = info.context.user
        if user.contest.id != root.id:
            raise ValueError("You Don't Have Permission To Read Submissions")
        my_permissions = list(
            map(lambda perm: perm.code, user.permissions.all()))

        query_set = Submission.objects.filter(
            problem__contest__id=user.contest.id)
        if 'read:submissions' not in my_permissions:
            query_set = query_set.filter(issuer_id=user.id)

        return query_set

    class Meta:
        model = Contest
        only_fields = ('id', 'name', 'short_id', 'short_description', 'description', 'start_time',
                       'freezed', 'finish_time', 'permitted_languages', 'members')


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


class UpdateContestInput(graphene.InputObjectType):
    name = graphene.String()
    short_description = graphene.String()
    description = graphene.String()
    start_time = DateTime()
    freezed = graphene.Boolean()
    finish_time = DateTime()
    permitted_languages = graphene.List(graphene.String)


class UpdateContest(graphene.Mutation):
    class Arguments:
        contest = UpdateContestInput(required=True)

    Output = ContestType

    @staticmethod
    @transaction.atomic
    @with_permission('update:info', "You Don't Have Permission To Update Contest")
    def mutate(_root, info, contest):
        user = info.context.user
        updating_contest = user.contest
        for k in ['name', 'short_description', 'description', 'start_time', 'freezed', 'finish_time']:
            if contest[k] is not None:
                setattr(updating_contest, k, getattr(contest, k))
        updating_contest.save()
        if contest['permitted_languages']:
            langs = Language.objects.filter(
                id__in=contest['permitted_languages'])
            updating_contest.permitted_languages.set(langs)
            updating_contest.save()

        return updating_contest


class InviteUsers(graphene.Mutation):
    class Arguments:
        emails = graphene.List(graphene.String)
        permissions = graphene.List(graphene.String)

    Output = graphene.List(UserType)

    @staticmethod
    @transaction.atomic
    @with_permission('invite:users', "You Don't Have Permission To Invite Users")
    def mutate(_root, info, emails, permissions):
        user = info.context.user

        my_permissions = list(
            map(lambda perm: perm.code, user.permissions.all()))

        for perm in permissions:
            if perm not in my_permissions:
                raise ValueError(
                    "You Don't Have Permission To Give Other User Permission \"{}\"".format(perm))

        current_users = User.objects.filter(
            contest__id=user.contest.id, email__in=emails).count()
        if current_users > 0:
            raise ValueError("Some User Already Invited")

        permissions = Permission.objects.filter(code__in=permissions)
        new_users = []
        for email in emails:
            signup_otc = "".join([random.choice("0123456789")
                                  for _ in range(8)])
            new_user = User(email=email, contest=user.contest,
                            signup_otc=signup_otc)
            new_user.full_clean()
            new_user.save()
            new_user.permissions.add(*permissions)
            new_users += [new_user]
        return new_users


class SubmitSolution(graphene.Mutation):
    class Arguments:
        problem_id = graphene.String(required=True)
        language_id = graphene.String(required=True)
        source_code = Upload(required=True)

    Output = SubmissionType

    @staticmethod
    @transaction.atomic
    @with_permission('create:submissions', "You Don't Have Permission To Submit Problem")
    def mutate(_root, info, problem_id, language_id, source_code):
        user = info.context.user

        try:
            problem = Problem.objects.filter(
                contest__id=user.contest.id, id=problem_id).get()
        except Problem.DoesNotExist:
            raise ValueError("No Such Problem")

        try:
            language = Language.objects.get(pk=language_id)
        except Language.DoesNotExist:
            raise ValueError("No Such Language")

        contest = user.contest
        permitted_langs = list(
            map(lambda lang: lang.id, contest.permitted_languages.all()))
        if language.id not in permitted_langs:
            raise ValueError("Language Is Not Permitted")

        sub = Submission(problem=problem, solution_source=source_code,
                         solution_language=language, issuer=user)
        sub.save()

        grade_submission.delay(sub)

        return sub


class Query(ProblemQuery, graphene.ObjectType):
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

    @staticmethod
    @with_me
    def resolve_me(_, info):
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

    def resolve_languages(self, _info):
        return Language.objects.all()


class Mutation(ProblemMutation, graphene.ObjectType):
    create_contest = CreateContest.Field()
    sign_in = SignIn.Field()
    sign_up = SignUp.Field()
    forgot_password = ForgotPassword.Field()
    reset_password = ResetPassword.Field()
    update_contest = UpdateContest.Field()
    invite_users = InviteUsers.Field()
    submit_solution = SubmitSolution.Field()
