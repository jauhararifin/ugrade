from typing import Iterable

from django.core.files import File

from contests.models import Submission, Language
from contests.auth.core import get_me
from .core import get_contest_submissions, get_submission_by_id, submit_solution


def submission_language_resolver(root: Submission, _info) -> Language:
    return root.solution_language


def submission_source_code_resolver(root: Submission, _info) -> str:
    return root.solution_source.url


def submission_resolver(_root, info, submission_id: str) -> Submission:
    user = get_me(info.context)
    return get_submission_by_id(user, submission_id)


def submissions_resolver(_root, info) -> Iterable[Submission]:
    user = get_me(info.context)
    return get_contest_submissions(user, user.contest.id)


def submit_solution_mutate(_root,
                           info,
                           problem_id: str,
                           language_id: str,
                           source_code: File) -> Submission:
    user = get_me(info.context)
    return submit_solution(user, problem_id, language_id, source_code)
