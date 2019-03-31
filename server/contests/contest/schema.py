from typing import Iterable

import graphene
from graphene_django import DjangoObjectType

from contests.auth.schemas import UserType
from contests.auth.core import get_contest_users, get_me
from contests.problem.core import get_contest_problems
from contests.problem.schemas import ProblemType
from contests.models import Language, Contest, User, Problem, Submission
from contests.submission.schemas import SubmissionType
from contests.submission.core import get_contest_submissions
from .core import get_language_by_id, \
    get_all_languages, \
    get_all_contests, \
    get_contest_by_id, \
    get_contest_by_short_id, \
    create_contest, \
    update_contest, \
    invite_users


class LanguageType(DjangoObjectType):
    extensions = graphene.List(graphene.String)

    @staticmethod
    def resolve_extensions(root, _info):
        return root.extension_list

    class Meta:
        model = Language
        only_fields = ('id', 'name', 'extensions')


class ContestType(DjangoObjectType):
    members = graphene.NonNull(graphene.List(UserType, required=True))
    problems = graphene.NonNull(graphene.List(ProblemType, required=True))
    submissions = graphene.NonNull(
        graphene.List(SubmissionType, required=True))

    @staticmethod
    def resolve_members(root: Contest, _info) -> Iterable[User]:
        return get_contest_users(root.id)

    @staticmethod
    def resolve_problems(root: Contest, info) -> Iterable[Problem]:
        user = get_me(info.context)
        return get_contest_problems(user, root.id)

    @staticmethod
    def resolve_submissions(root: Contest, info) -> Iterable[Submission]:
        user = get_me(info.context)
        return get_contest_submissions(user, root.id)

    class Meta:
        model = Contest
        only_fields = ('id', 'name', 'short_id', 'short_description', 'description', 'start_time',
                       'freezed', 'finish_time', 'permitted_languages', 'members', 'grading_size')


def language_resolver(_root, _info, lang_id: str) -> Language:
    return get_language_by_id(lang_id)


def languages_resolver(_root, _info) -> Iterable[Language]:
    return get_all_languages()


def contest_resolver(_root, _info, contest_id: str) -> Contest:
    return get_contest_by_id(contest_id)


def contest_by_short_id_resolver(_root, _info, short_id: str) -> Contest:
    return get_contest_by_short_id(short_id)


def contests_resolver(_root, _info) -> Iterable[Contest]:
    return get_all_contests()


class ContestQuery(graphene.ObjectType):
    languages = graphene.NonNull(graphene.List(
        LanguageType, required=True), resolver=languages_resolver)
    language = graphene.NonNull(LanguageType, lang_id=graphene.String(
        required=True), resolver=language_resolver)

    contest = graphene.NonNull(
        ContestType, contest_id=graphene.String(required=True), resolver=contest_resolver)
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


class CreateContest(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        contest = ContestInput(required=True)

    contest = graphene.Field(ContestType)
    admin = graphene.Field(UserType)

    @staticmethod
    def mutate(_self, _info, email: str, contest: ContestInput) -> 'CreateContest':
        contest, user = create_contest(email,
                                       contest.name,
                                       contest.short_id,
                                       contest.short_description,
                                       contest.description,
                                       contest.start_time,
                                       contest.finish_time,
                                       contest.freezed,
                                       contest.grading_size)
        return CreateContest(contest=contest, admin=user)


class UpdateContestInput(graphene.InputObjectType):
    name = graphene.String()
    short_description = graphene.String()
    description = graphene.String()
    start_time = graphene.DateTime()
    freezed = graphene.Boolean()
    finish_time = graphene.DateTime()
    permitted_languages = graphene.List(graphene.String)


class UpdateContest(graphene.Mutation):
    class Arguments:
        contest = UpdateContestInput(required=True)

    Output = ContestType

    @staticmethod
    def mutate(_root, info, contest):
        user = get_me(info.context)
        new_contest = update_contest(user,
                                     contest.name,
                                     contest.short_description,
                                     contest.description,
                                     contest.start_time,
                                     contest.finish_time,
                                     contest.freezed,
                                     contest.grading_size,
                                     contest.permitted_languages)
        return new_contest


class InviteUsers(graphene.Mutation):
    class Arguments:
        emails = graphene.List(graphene.String)
        permissions = graphene.List(graphene.String)

    Output = graphene.List(UserType)

    @staticmethod
    def mutate(_root, info, emails, permissions):
        user = get_me(info.context)
        return invite_users(user, emails, permissions)


class ContestMutation(graphene.ObjectType):
    create_contest = CreateContest.Field()
    update_contest = UpdateContest.Field()
    invite_users = InviteUsers.Field()
