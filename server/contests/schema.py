import datetime

import graphene
from graphene.types.datetime import DateTime

from .auth.schemas import AuthQuery, AuthMutation
from .problem.schemas import ProblemQuery, ProblemMutation
from .contest.schema import ContestQuery

# class SubmissionType(DjangoObjectType):
#     language = graphene.Field(LanguageType)
#     source_code = graphene.Field(graphene.String)

#     @staticmethod
#     def resolve_language(root, _info):
#         return root.solution_language

#     @staticmethod
#     def resolve_source_code(root, _info):
#         return root.source_code.url

#     class Meta:
#         model = Submission
#         only_fields = ('id', 'problem', 'language', 'issued_time', 'issuer')


# class ContestType(DjangoObjectType):
#     user = graphene.Field(UserType, id=graphene.String())
#     user_by_email = graphene.Field(UserType, email=graphene.String())
#     user_by_username = graphene.Field(UserType, username=graphene.String())
#     problem = graphene.Field(ProblemType, id=graphene.String())
#     problems = graphene.List(ProblemType, required=True)
#     submissions = graphene.List(SubmissionType)

#     @staticmethod
#     def resolve_user(root, _, id):
#         try:
#             user = User.objects.get(pk=id)
#             if user.contest.id != root.id:
#                 raise ValueError("No Such User")
#             return user
#         except User.DoesNotExist:
#             raise ValueError("No Such User")

#     @staticmethod
#     def resolve_user_by_email(root, _, **kwargs):
#         try:
#             return User.objects.get(contest__id=root.id, email=kwargs.get('email'))
#         except User.DoesNotExist:
#             raise ValueError("No Such User")

#     @staticmethod
#     def resolve_user_by_username(root, _, **kwargs):
#         try:
#             return User.objects.get(
#                 contest__id=root.id,
#                 username=kwargs.get('username')
#             )
#         except User.DoesNotExist:
#             raise ValueError("No Such User")

#     @staticmethod
#     @with_permission('read:problems', "You Don't Have Permission To Read Problems")
#     def resolve_problem(root, info, id):
#         user = info.context.user
#         permissions = user.permissions.filter(
#             code__in=['read:problems', 'read:disabledProblems'])
#         permissions = map(lambda perm: perm.code, permissions)
#         permissions = list(permissions)
#         try:
#             problem = Problem.objects.get(pk=id)
#             if problem.contest.id != root.id:
#                 raise ValueError("No Such Problem")
#             if problem.disabled and 'read:disabledProblems' not in permissions:
#                 raise ValueError("No Such Problem")
#             return problem
#         except Problem.DoesNotExist:
#             raise ValueError("No Such Problem")
#         raise ValueError("Internal Server Error")

#     @staticmethod
#     @with_permission('read:problems', "You Don't Have Permission To Read Problems")
#     def resolve_problems(root, info):
#         user = info.context.user
#         if user.contest.id != root.id:
#             raise ValueError("You Don't Have Permission To Read Problems")
#         permissions = user.permissions.filter(
#             code__in=['read:problems', 'read:disabledProblems'])
#         permissions = map(lambda perm: perm.code, permissions)
#         permissions = list(permissions)
#         if 'read:problems' not in permissions:
#             raise ValueError("You Don't Have Permission To Read Problems")
#         query_set = Problem.objects.filter(
#             contest__id=user.contest.id).order_by('order')
#         if 'read:disabledProblems' not in permissions:
#             query_set = query_set.filter(disabled=False)
#         return query_set

#     @staticmethod
#     @with_me
#     def resolve_submissions(root, info):
#         user = info.context.user
#         if user.contest.id != root.id:
#             raise ValueError("You Don't Have Permission To Read Submissions")
#         my_permissions = list(
#             map(lambda perm: perm.code, user.permissions.all()))

#         query_set = Submission.objects.filter(
#             problem__contest__id=user.contest.id)
#         if 'read:submissions' not in my_permissions:
#             query_set = query_set.filter(issuer_id=user.id)

#         return query_set

#     class Meta:
#         model = Contest
#         only_fields = ('id', 'name', 'short_id', 'short_description', 'description', 'start_time',
#                        'freezed', 'finish_time', 'permitted_languages', 'members')


# class SubmitSolution(graphene.Mutation):
#     class Arguments:
#         problem_id = graphene.String(required=True)
#         language_id = graphene.String(required=True)
#         source_code = Upload(required=True)

#     Output = SubmissionType

#     @staticmethod
#     @transaction.atomic
#     @with_permission('create:submissions', "You Don't Have Permission To Submit Problem")
#     def mutate(_root, info, problem_id, language_id, source_code):
#         user = info.context.user

#         try:
#             problem = Problem.objects.filter(
#                 contest__id=user.contest.id, id=problem_id).get()
#         except Problem.DoesNotExist:
#             raise ValueError("No Such Problem")

#         try:
#             language = Language.objects.get(pk=language_id)
#         except Language.DoesNotExist:
#             raise ValueError("No Such Language")

#         contest = user.contest
#         permitted_langs = list(
#             map(lambda lang: lang.id, contest.permitted_languages.all()))
#         if language.id not in permitted_langs:
#             raise ValueError("Language Is Not Permitted")

#         sub = Submission(problem=problem, solution_source=source_code,
#                          solution_language=language, issuer=user)
#         sub.save()

#         grade_submission.delay(sub)

#         return sub


class Query(AuthQuery, ProblemQuery, ContestQuery, graphene.ObjectType):
    clock = DateTime()

    @staticmethod
    def resolve_clock(_root, _info):
        return datetime.datetime.now()


class Mutation(AuthMutation, ProblemMutation, graphene.ObjectType):
    pass
    # submit_solution = SubmitSolution.Field()
