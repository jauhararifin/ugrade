from typing import Iterable

import graphene
from graphene_django.types import DjangoObjectType
from django.db import transaction

from contests.models import Problem
from contests.auth.core import get_me
from .core import create_problem, \
    update_problem, \
    delete_problem, \
    get_problem_by_id, \
    get_contest_problems


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
    def mutate(_root, info, problem: ProblemInput) -> Problem:
        user = get_me(info.context)
        return create_problem(user,
                              problem.short_id,
                              problem.name,
                              problem.statement,
                              problem.disabled,
                              problem.time_limit,
                              problem.tolerance,
                              problem.memory_limit,
                              problem.output_limit)


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
        problem_id = graphene.String(required=True)
        problem = ProblemModificationInput(required=True)

    Output = ProblemType

    @staticmethod
    def mutate(_root, info, problem_id: str, problem: ProblemModificationInput) -> Problem:
        user = get_me(info.context)
        return update_problem(user,
                              problem_id,
                              problem.short_id,
                              problem.name,
                              problem.statement,
                              problem.disabled,
                              problem.time_limit,
                              problem.tolerance,
                              problem.memory_limit,
                              problem.output_limit)


class DeleteProblem(graphene.Mutation):
    class Arguments:
        problem_id = graphene.String(required=True)

    Output = graphene.String

    @staticmethod
    def mutate(_root, info, problem_id: str) -> str:
        user = get_me(info.context)
        return delete_problem(user, problem_id)


class ProblemQuery:
    problem = graphene.NonNull(
        ProblemType, problem_id=graphene.String(required=True))

    problems = graphene.NonNull(graphene.List(ProblemType, required=True))

    @staticmethod
    def resolve_problem(_root, info, problem_id: str) -> Problem:
        user = get_me(info.context)
        return get_problem_by_id(user, problem_id)

    @staticmethod
    def resolve_problems(_root, info) -> Iterable[Problem]:
        user = get_me(info.context)
        return get_contest_problems(user, user.contest.id)


class ProblemMutation(graphene.ObjectType):
    create_problem = CreateProblem.Field()
    update_problem = UpdateProblem.Field()
    delete_problem = DeleteProblem.Field()
