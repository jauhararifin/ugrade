from typing import Iterable, NamedTuple, Optional

from django.db import transaction

from contests.models import Problem
from contests.auth.core import get_me
from .core import create_problem, \
    update_problem, \
    delete_problem, \
    get_problem_by_id, \
    get_contest_problems


class ProblemInput(NamedTuple):
    short_id: str
    name: str
    statement: str
    disabled: bool
    time_limit: int
    tolerance: float
    memory_limit: int
    output_limit: int


class ProblemModificationInput(NamedTuple):
    short_id: Optional[str]
    name: Optional[str]
    statement: Optional[str]
    disabled: Optional[bool]
    time_limit: Optional[int]
    tolerance: Optional[float]
    memory_limit: Optional[int]
    output_limit: Optional[int]


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
