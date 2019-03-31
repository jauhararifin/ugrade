from django.db import transaction
from django.db.models import Max

from contests.models import Problem
from contests.auth.core import get_user_from_token
from contests.exceptions import ForbiddenActionError


@transaction.atomic
def create_problem(
    token: str,
    short_id: str,
    name: str,
    statement: str,
    disabled: bool,
    time_limit: int,
    tolerance: float,
    memory_limit: int,
    output_limit: int,
) -> Problem:
    user = get_user_from_token(token)
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
