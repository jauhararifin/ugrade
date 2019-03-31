from typing import Iterable

from django.db import transaction

from contests.schema import ProblemInput, ProblemModificationInput
from contests.models import Problem
from contests.auth.core import get_me
from .core import create_problem, \
    update_problem, \
    delete_problem, \
    get_problem_by_id, \
    get_contest_problems


@transaction.atomic
def create_problem_mutate(_root, info, problem: ProblemInput) -> Problem:
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


def update_problem_mutate(_root,
                          info,
                          problem_id: str,
                          problem: ProblemModificationInput) -> Problem:
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


def delete_problem_mutate(_root, info, problem_id: str) -> str:
    user = get_me(info.context)
    return delete_problem(user, problem_id)


def problem_resolver(_root, info, problem_id: str) -> Problem:
    user = get_me(info.context)
    return get_problem_by_id(user, problem_id)


def problems_resolver(_root, info) -> Iterable[Problem]:
    user = get_me(info.context)
    return get_contest_problems(user, user.contest.id)
