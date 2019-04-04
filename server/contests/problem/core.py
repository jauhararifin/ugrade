from typing import Optional, Iterable

from django.db import transaction
from django.db.models import Max

from contests.models import User, Problem
from contests.exceptions import ForbiddenActionError, NoSuchProblemError


def get_contest_problems(user: User, contest_id: int) -> Iterable[Problem]:
    if not user.has_permission('read:problems'):
        raise ForbiddenActionError(
            "You Don't Have Permission To Read Problems")

    user_cid = user.contest.id
    if contest_id != user_cid:
        raise ForbiddenActionError(
            "You Don't Have Permission To Read Problems In This Contest")

    problems_qs = user.contest.problems
    if not user.has_permission('read:disabledProblems'):
        problems_qs = problems_qs.filter(disabled=False)

    return problems_qs.all()


def get_problem_by_id(user: User, problem_id: int) -> Problem:
    if not user.has_permission('read:problems'):
        raise ForbiddenActionError(
            "You Don't Have Permission To Read Problems")

    try:
        problem = Problem.objects.get(pk=problem_id)
    except Problem.DoesNotExist:
        raise NoSuchProblemError()

    # check problem visibility
    user_cid: User = user.contest.id
    problem_cid: int = problem.contest.id
    in_same_contest: bool = problem_cid == user_cid
    can_read: bool = not problem.disabled or user.has_permission(
        'read:disabledProblems')
    if not in_same_contest or not can_read:
        raise NoSuchProblemError()

    return problem


@transaction.atomic
def create_problem(user: User,
                   short_id: str,
                   name: str,
                   statement: str,
                   disabled: bool,
                   time_limit: int,
                   tolerance: float,
                   memory_limit: int,
                   output_limit: int,
                   ) -> Problem:
    if not user.has_permission('create:problems'):
        raise ForbiddenActionError(
            "You Don't Have Permission To Create Problem")

    last_order = Problem.objects.filter(
        contest__id=user.contest.id).aggregate(Max('order'))
    new_prob = Problem(short_id=short_id,
                       name=name,
                       statement=statement,
                       disabled=disabled,
                       time_limit=time_limit,
                       tolerance=tolerance,
                       memory_limit=memory_limit,
                       output_limit=output_limit,
                       order=last_order['order__max'] + 1,
                       contest=user.contest)
    new_prob.save()
    return new_prob


def update_problem(user: User,
                   problem_id: int,
                   short_id: Optional[str],
                   name: Optional[str],
                   statement: Optional[str],
                   disabled: Optional[bool],
                   time_limit: Optional[int],
                   tolerance: Optional[float],
                   memory_limit: Optional[int],
                   output_limit: Optional[int]) -> Problem:
    if not user.has_permission('update:problems'):
        raise ForbiddenActionError(
            "You Don't Have Permission To Update Problem")

    try:
        prob = Problem.objects.get(pk=problem_id)
    except Problem.DoesNotExist:
        raise NoSuchProblemError()

    permissions = map(lambda user: user.code, user.permissions.all())
    if prob.disabled and 'read:disabledProblems' not in permissions:
        raise ValueError("No Such Problem")

    if short_id is not None:
        prob.short_id = short_id
    if name is not None:
        prob.name = name
    if statement is not None:
        prob.statement = statement
    if disabled is not None:
        prob.disabled = disabled
    if time_limit is not None:
        prob.time_limit = time_limit
    if tolerance is not None:
        prob.tolerance = tolerance
    if memory_limit is not None:
        prob.memory_limit = memory_limit
    if output_limit is not None:
        prob.output_limit = output_limit

    prob.save()
    return prob


def delete_problem(user: User, problem_id: int) -> int:
    if not user.has_permission('delete:problems'):
        raise ForbiddenActionError(
            "You Don't Have Permission To Delete Problem")

    try:
        prob = Problem.objects.get(pk=problem_id)
    except Problem.DoesNotExist:
        raise NoSuchProblemError()

    if prob.disabled and not user.has_permission('read:disabledProblems'):
        raise NoSuchProblemError()

    prob.delete()
    return problem_id
