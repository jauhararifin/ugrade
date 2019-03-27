import random
import datetime
import bcrypt
import jwt

import graphene
from graphene.types.datetime import DateTime
from graphene_django.types import DjangoObjectType

from graphene_file_upload.scalars import Upload

from django.conf import settings
from django.db import transaction
from django.db.models import Max
from django.core.files.storage import default_storage

from contests.models import Contest, Language, User, Permission, Problem, Submission


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


class ProblemType(DjangoObjectType):
    class Meta:
        model = Problem
        only_fields = ('id', 'short_id', 'name', 'statement', 'contest', 'disabled',
                       'order', 'time_limit', 'tolerance', 'memory_limit', 'output_limit')


class ProblemInput(graphene.InputObjectType):
    short_id = graphene.String(required=True)
    name = graphene.String(required=True)
    statement = graphene.String(required=True)
    disabled = graphene.Boolean(required=True)
    time_limit = graphene.Int(required=True)
    tolerance = graphene.Float(required=True)
    memory_limit = graphene.Int(required=True)
    output_limit = graphene.Int(required=True)


class CreateProblem(graphene.Mutation):
    class Arguments:
        problem = ProblemInput(required=True)

    Output = ProblemType

    @staticmethod
    @transaction.atomic
    @with_me
    def mutate(_root, info, problem):
        user = info.context.user
        permissions = list(map(lambda perm: perm.code, user.permissions.all()))
        if 'create:problems' not in permissions:
            raise ValueError("You Don't Have Permission To Create Problem")
        last_order = Problem.objects.filter(
            contest__id=user.contest.id).aggregate(Max('order'))
        new_prob = Problem(
            **problem, order=last_order['order__max'] + 1, contest=user.contest)
        new_prob.save()
        return new_prob


class UpdateProblem(graphene.Mutation):
    class Arguments:
        problem_id = graphene.String(required=True)
        problem = ProblemInput(required=True)

    Output = ProblemType

    @staticmethod
    @with_me
    def mutate(_root, info, problem_id, problem):
        user = info.context.user
        permissions = list(map(lambda perm: perm.code, user.permissions.all()))
        if 'update:problems' not in permissions:
            raise ValueError("You Don't Have Permission To Update Problem")
        try:
            prob = Problem.objects.get(pk=problem_id)
        except Problem.DoesNotExist:
            raise ValueError("No Such Problem")
        if prob.disabled and 'read:disabledProblems' not in permissions:
            raise ValueError("No Such Problem")
        for k in problem:
            setattr(prob, k, problem[k])
        prob.save()
        return prob


class DeleteProblem(graphene.Mutation):
    class Arguments:
        problem_id = graphene.String(required=True)

    Output = graphene.String

    @staticmethod
    @with_me
    def mutate(_root, info, problem_id):
        user = info.context.user
        permissions = list(map(lambda perm: perm.code, user.permissions.all()))
        if 'delete:problems' not in permissions:
            raise ValueError("You Don't Have Permission To Delete Problem")
        try:
            prob = Problem.objects.get(pk=problem_id)
        except Problem.DoesNotExist:
            raise ValueError("No Such Problem")
        if prob.disabled and 'read:disabledProblems' not in permissions:
            raise ValueError("No Such Problem")
        prob.delete()
        return problem_id


class ContestType(DjangoObjectType):
    user = graphene.Field(UserType, id=graphene.String())
    user_by_email = graphene.Field(UserType, email=graphene.String())
    user_by_username = graphene.Field(UserType, username=graphene.String())
    problem = graphene.Field(ProblemType, id=graphene.String())
    problems = graphene.List(ProblemType, required=True)

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
    @with_me
    def resolve_problem(root, info, id):
        user = info.context.user
        permissions = user.permissions.filter(
            code__in=['read:problems', 'read:disabledProblems'])
        permissions = map(lambda perm: perm.code, permissions)
        permissions = list(permissions)
        if 'read:problems' not in permissions:
            raise ValueError("You Don't Have Permission To Read Problems")
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
    @with_me
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
    @with_me
    def mutate(root, info, contest):
        user = info.context.user
        permissions = list(map(lambda perm: perm.code, user.permissions.all()))
        if 'update:info' not in permissions:
            raise ValueError("You Don't Have Permission To Update Contest")
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
    @with_me
    def mutate(root, info, emails, permissions):
        user = info.context.user

        my_permissions = list(
            map(lambda perm: perm.code, user.permissions.all()))
        if 'invite:users' not in my_permissions:
            raise ValueError("You Don't Have Permission To Invite Users")

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


class SubmissionType(DjangoObjectType):
    class Meta:
        model = Submission
        only_fields = ('id', 'problem', 'language', 'issued_time')


class SubmitSolution(graphene.Mutation):
    class Arguments:
        problem_id = graphene.String(required=True)
        language_id = graphene.String(required=True)
        source_code = Upload(required=True)

    Output = SubmissionType

    @staticmethod
    @transaction.atomic
    @with_me
    def mutate(root, info, problem_id, language_id, source_code):
        user = info.context.user

        my_permissions = list(
            map(lambda perm: perm.code, user.permissions.all()))
        if 'create:submissions' not in my_permissions:
            raise ValueError("You Don't Have Permission To Submit Problem")

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

        sub = Submission(problem=problem, language=language)
        sub.save()

        filename = "submissions/submission-{}".format(sub.id)
        default_storage.save(filename, source_code)

        return sub


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

    def resolve_languages(self, info):
        return Language.objects.all()


class Mutation(graphene.ObjectType):
    create_contest = CreateContest.Field()
    sign_in = SignIn.Field()
    sign_up = SignUp.Field()
    forgot_password = ForgotPassword.Field()
    reset_password = ResetPassword.Field()
    create_problem = CreateProblem.Field()
    update_problem = UpdateProblem.Field()
    delete_problem = DeleteProblem.Field()
    update_contest = UpdateContest.Field()
    invite_users = InviteUsers.Field()
    submit_solution = SubmitSolution.Field()
