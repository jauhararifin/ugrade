import graphene
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload

from .models import Submission, Language, Problem, Contest, User
from .auth.resolvers import user_permissions_resolver, \
    sign_in_mutate, \
    sign_up_mutate, \
    forgot_password_mutate, \
    reset_passwod_mutate, \
    me_resolver, \
    user_resolver, \
    users_resolver, \
    user_by_username_resolver, \
    user_by_email_resolver
from .contest.resolvers import language_extensions_resolver, \
    contest_members_resolver, \
    contest_problems_resolver, \
    contest_submissions_resolver, \
    language_resolver, \
    languages_resolver, \
    contest_resolver, \
    contest_by_short_id_resolver, \
    contests_resolver, \
    create_contest_mutate, \
    update_contest_mutate, \
    invite_users_mutate, \
    update_user_permissions_mutate
from .problem.resolvers import create_problem_mutate, \
    update_problem_mutate, \
    delete_problem_mutate, \
    problem_resolver, \
    problems_resolver
from .submission.resolvers import submission_language_resolver, \
    submission_source_code_resolver, \
    submission_resolver, \
    submissions_resolver, \
    submit_solution_mutate
from .status.resolvers import ping_resolver, server_clock_resolver


class UserType(DjangoObjectType):
    permissions = graphene.NonNull(graphene.List(
        graphene.String, required=True), resolver=user_permissions_resolver)

    class Meta:
        model = User
        only_fields = ('id', 'name', 'username', 'email', 'contest')


class SignInResult(graphene.ObjectType):
    user = graphene.Field(UserType, required=True)
    token = graphene.Field(graphene.String, required=True)


class SignIn(graphene.Mutation):
    class Arguments:
        contest_id = graphene.Int(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
    Output = SignInResult
    mutate = sign_in_mutate


class UserInput(graphene.InputObjectType):
    username = graphene.String(required=True)
    name = graphene.String(required=True)
    password = graphene.String(required=True)


class SignUpResult(graphene.ObjectType):
    user = graphene.Field(UserType, required=True)
    token = graphene.Field(graphene.String, required=True)


class SignUp(graphene.Mutation):
    class Arguments:
        contest_id = graphene.String(required=True)
        email = graphene.String(required=True)
        user = UserInput(required=True)
        signup_code = graphene.String(required=True)
    Output = SignUpResult
    mutate = sign_up_mutate


class ForgotPassword(graphene.Mutation):
    class Arguments:
        contest_id = graphene.Int(required=True)
        email = graphene.String(required=True)
    Output = UserType
    mutate = forgot_password_mutate


class ResetPassword(graphene.Mutation):
    class Arguments:
        contest_id = graphene.Int(required=True)
        email = graphene.String(required=True)
        reset_password_otc = graphene.String(required=True)
        new_password = graphene.String(required=True)
    Output = UserType
    mutate = reset_passwod_mutate


class AuthQuery(graphene.ObjectType):
    me = graphene.NonNull(UserType, resolver=me_resolver)
    user = graphene.NonNull(UserType, user_id=graphene.Int(
        required=True), resolver=user_resolver)
    users = graphene.NonNull(graphene.List(
        UserType, required=True), resolver=users_resolver)
    user_by_username = graphene.NonNull(UserType, contest_id=graphene.Int(
        required=True), username=graphene.String(required=True), resolver=user_by_username_resolver)
    user_by_email = graphene.NonNull(UserType, contest_id=graphene.Int(
        required=True), email=graphene.String(required=True), resolver=user_by_email_resolver)


class AuthMutation(graphene.ObjectType):
    sign_in = SignIn.Field()
    sign_up = SignUp.Field()
    forgot_password = ForgotPassword.Field()
    reset_password = ResetPassword.Field()


class LanguageType(DjangoObjectType):
    extensions = graphene.NonNull(graphene.List(
        graphene.String, required=True), resolver=language_extensions_resolver)

    class Meta:
        model = Language
        only_fields = ('id', 'name')


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
    mutate = create_problem_mutate


class ProblemModificationInput(graphene.InputObjectType):
    short_id = graphene.String()
    name = graphene.String()
    statement = graphene.String()
    disabled = graphene.Boolean()
    time_limit = graphene.Int()
    tolerance = graphene.Float()
    memory_limit = graphene.Int()
    output_limit = graphene.Int()


class UpdateProblem(graphene.Mutation):
    class Arguments:
        problem_id = graphene.Int(required=True)
        problem = ProblemModificationInput(required=True)
    Output = ProblemType
    mutate = update_problem_mutate


class DeleteProblem(graphene.Mutation):
    class Arguments:
        problem_id = graphene.Int(required=True)
    Output = graphene.String
    mutate = delete_problem_mutate


class ProblemQuery(graphene.ObjectType):
    problem = graphene.NonNull(
        ProblemType, problem_id=graphene.Int(required=True), resolver=problem_resolver)

    problems = graphene.NonNull(graphene.List(
        ProblemType, required=True), resolver=problems_resolver)


class ProblemMutation(graphene.ObjectType):
    create_problem = CreateProblem.Field()
    update_problem = UpdateProblem.Field()
    delete_problem = DeleteProblem.Field()


class SubmissionType(DjangoObjectType):
    language = graphene.Field(
        LanguageType, required=True, resolver=submission_language_resolver)
    source_code = graphene.Field(
        graphene.String, required=True, resolver=submission_source_code_resolver)

    @staticmethod
    def resolve_language(root, _info):
        return root.solution_language

    @staticmethod
    def resolve_source_code(root, _info):
        return root.source_code.url

    class Meta:
        model = Submission
        only_fields = ('id', 'problem', 'issued_time', 'issuer')


class SubmissionQuery(graphene.ObjectType):
    submission = graphene.NonNull(SubmissionType, id=graphene.Int(
        required=True), resolver=submission_resolver)
    submissions = graphene.NonNull(graphene.List(
        SubmissionType, required=True), resolver=submissions_resolver)


class SubmitSolution(graphene.Mutation):
    class Arguments:
        problem_id = graphene.Int(required=True)
        language_id = graphene.Int(required=True)
        source_code = Upload(required=True)
    Output = SubmissionType
    mutate = submit_solution_mutate


class SubmissionMutation(graphene.ObjectType):
    submit_solution = SubmitSolution.Field()


class ContestType(DjangoObjectType):
    members = graphene.NonNull(graphene.List(
        UserType, required=True), resolver=contest_members_resolver)
    problems = graphene.NonNull(graphene.List(
        ProblemType, required=True), resolver=contest_problems_resolver)
    submissions = graphene.NonNull(
        graphene.List(SubmissionType, required=True), resolver=contest_submissions_resolver)

    class Meta:
        model = Contest
        only_fields = ('id', 'name', 'short_id', 'short_description', 'description', 'start_time',
                       'freezed', 'finish_time', 'permitted_languages', 'members', 'grading_size')


class ContestQuery(graphene.ObjectType):
    languages = graphene.NonNull(graphene.List(
        LanguageType, required=True), resolver=languages_resolver)
    language = graphene.NonNull(LanguageType, lang_id=graphene.Int(
        required=True), resolver=language_resolver)

    contest = graphene.NonNull(
        ContestType, contest_id=graphene.Int(required=True), resolver=contest_resolver)
    contest_by_short_id = graphene.NonNull(
        ContestType, short_id=graphene.String(required=True), resolver=contest_by_short_id_resolver)
    contests = graphene.NonNull(graphene.List(
        ContestType, required=True), resolver=contests_resolver)


class ContestInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    short_id = graphene.String(required=True)
    short_description = graphene.String(required=True)
    description = graphene.String(
        default_value='Just another competitive programming competition')
    start_time = graphene.DateTime()
    freezed = graphene.Boolean(default_value=False)
    finish_time = graphene.DateTime()
    grading_size = graphene.Int(default_value=1)


class CreateContest(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        contest = ContestInput(required=True)
    contest = graphene.Field(ContestType)
    admin = graphene.Field(UserType)
    mutate = create_contest_mutate


class UpdateContestInput(graphene.InputObjectType):
    name = graphene.String()
    short_description = graphene.String()
    description = graphene.String()
    start_time = graphene.DateTime()
    freezed = graphene.Boolean()
    finish_time = graphene.DateTime()
    permitted_languages = graphene.List(graphene.String)
    grading_size = graphene.Int()


class UpdateContest(graphene.Mutation):
    class Arguments:
        contest = UpdateContestInput(required=True)
    Output = ContestType
    mutate = update_contest_mutate


class InviteUsers(graphene.Mutation):
    class Arguments:
        emails = graphene.NonNull(
            graphene.List(graphene.String, required=True))
        permissions = graphene.NonNull(
            graphene.List(graphene.String, required=True))
    Output = graphene.List(UserType)
    mutate = invite_users_mutate


class UpdateUserPermissions(graphene.Mutation):
    class Arguments:
        user_id = graphene.Int(required=True)
        permissions = graphene.NonNull(
            graphene.List(graphene.String, required=True))
    Output = UserType
    mutate = update_user_permissions_mutate


class ContestMutation(graphene.ObjectType):
    create_contest = CreateContest.Field()
    update_contest = UpdateContest.Field()
    invite_users = InviteUsers.Field()
    update_user_permissions = UpdateUserPermissions.Field()


class StatusQuery():
    server_clock = graphene.DateTime(
        required=True, resolver=server_clock_resolver)
    ping = graphene.String(required=True, resolver=ping_resolver)


class Query(AuthQuery,
            ProblemQuery,
            ContestQuery,
            SubmissionQuery,
            StatusQuery,
            graphene.ObjectType):
    pass


class Mutation(AuthMutation,
               ProblemMutation,
               ContestMutation,
               SubmissionMutation,
               graphene.ObjectType):
    pass
