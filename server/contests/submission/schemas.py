from typing import Iterable

import graphene
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload
from django.core.files import File

from contests.models import Submission
from contests.auth.core import get_me
from contests.contest.schema import LanguageType
from .core import get_contest_submissions, get_submission_by_id, submit_solution


class SubmissionType(DjangoObjectType):
    language = graphene.Field(LanguageType, required=True)
    source_code = graphene.Field(graphene.String, required=True)

    @staticmethod
    def resolve_language(root, _info):
        return root.solution_language

    @staticmethod
    def resolve_source_code(root, _info):
        return root.source_code.url

    class Meta:
        model = Submission
        only_fields = ('id', 'problem', 'issued_time', 'issuer')


def submission_resolver(_root, info, submission_id: str) -> Submission:
    user = get_me(info.context)
    return get_submission_by_id(user, submission_id)


def submissions_resolver(_root, info) -> Iterable[Submission]:
    user = get_me(info.context)
    return get_contest_submissions(user, user.contest.id)


class SubmissionQuery(graphene.ObjectType):
    submission = graphene.NonNull(SubmissionType, id=graphene.String(
        required=True), resolver=submission_resolver)
    submissions = graphene.NonNull(graphene.List(
        SubmissionType, required=True), resolver=submissions_resolver)


class SubmitSolution(graphene.Mutation):
    class Arguments:
        problem_id = graphene.String(required=True)
        language_id = graphene.String(required=True)
        source_code = Upload(required=True)

    Output = SubmissionType

    @staticmethod
    def mutate(_root, info, problem_id: str, language_id: str, source_code: File) -> Submission:
        user = get_me(info.context)
        return submit_solution(user, problem_id, language_id, source_code)


class SubmissionMutation(graphene.ObjectType):
    submit_solution = SubmitSolution.Field()
