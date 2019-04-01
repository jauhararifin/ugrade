import datetime
from typing import Iterable, List, NamedTuple, Optional

from contests.auth.core import get_contest_users, get_me
from contests.problem.core import get_contest_problems
from contests.models import Language, Contest, User, Problem, Submission
from contests.submission.core import get_contest_submissions
from .core import get_language_by_id, \
    get_all_languages, \
    get_all_contests, \
    get_contest_by_id, \
    get_contest_by_short_id, \
    create_contest, \
    update_contest, \
    invite_users


class ContestInput(NamedTuple):
    name: str
    short_id: str
    short_description: str
    description: Optional[str]
    start_time: Optional[datetime.datetime]
    freezed: Optional[bool]
    finish_time: Optional[datetime.datetime]
    grading_size: Optional[int]


class CreateContestResult(NamedTuple):
    contest: Contest
    admin: User


class UpdateContestInput(NamedTuple):
    name: Optional[str]
    short_description: Optional[str]
    description: Optional[str]
    start_time: Optional[datetime.datetime]
    freezed: Optional[bool]
    finish_time: Optional[datetime.datetime]
    permitted_languages: Optional[str]
    grading_size: Optional[int]


def language_extensions_resolver(root: Language, _info) -> List[str]:
    return root.extension_list


def contest_members_resolver(root: Contest, _info) -> Iterable[User]:
    return get_contest_users(root.id)


def contest_problems_resolver(root: Contest, info) -> Iterable[Problem]:
    user = get_me(info.context)
    return get_contest_problems(user, root.id)


def contest_submissions_resolver(root: Contest, info) -> Iterable[Submission]:
    user = get_me(info.context)
    return get_contest_submissions(user, root.id)


def language_resolver(_root, _info, lang_id: int) -> Language:
    return get_language_by_id(lang_id)


def languages_resolver(_root, _info) -> Iterable[Language]:
    return get_all_languages()


def contest_resolver(_root, _info, contest_id: int) -> Contest:
    return get_contest_by_id(contest_id)


def contest_by_short_id_resolver(_root, _info, short_id: str) -> Contest:
    return get_contest_by_short_id(short_id)


def contests_resolver(_root, _info) -> Iterable[Contest]:
    return get_all_contests()


def create_contest_mutate(_self, _info, email: str, contest: ContestInput) -> CreateContestResult:
    new_contest, user = create_contest(email,
                                       contest.name,
                                       contest.short_id,
                                       contest.short_description,
                                       contest.description,
                                       contest.start_time,
                                       contest.finish_time,
                                       contest.freezed,
                                       contest.grading_size)
    return CreateContestResult(contest=new_contest, admin=user)


def update_contest_mutate(_root, info, contest: UpdateContestInput) -> Contest:
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


def invite_users_mutate(_root, info, emails: List[str], permissions: List[str]) -> Iterable[User]:
    user = get_me(info.context)
    return invite_users(user, emails, permissions)
