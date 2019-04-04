from typing import Iterable

from django.core.files import File

from contests.models import User, Submission
from contests.contest.core import get_contest_by_id, get_language_by_id
from contests.problem.core import get_problem_by_id
from contests.exceptions import ForbiddenActionError, NoSuchSubmissionError, ForbiddenLanguageError
from grading.grader import grade_submission


def get_contest_submissions(user: User, contest_id: int) -> Iterable[Submission]:
    my_contest = user.contest
    target_contest = get_contest_by_id(contest_id)
    if my_contest.id != target_contest.id:
        raise ForbiddenActionError(
            "You Don't Have Permission To Read Submission From This Contest")

    submissions_qs = Submission.objects.filter(problem__contest__id=contest_id)
    if not user.has_permission('read:submissions'):
        submissions_qs = submissions_qs.filter(issuer__id=user.id)

    return submissions_qs.all()


def get_submission_by_id(user: User, submission_id: int) -> Submission:
    try:
        submission = Submission.objects.get(pk=submission_id)
    except Submission.DoesNotExist:
        raise NoSuchSubmissionError()

    if submission.contest.id != user.contest.id:
        raise NoSuchSubmissionError()

    if not user.has_permission('read:submissions') and submission.issuer.id != user.id:
        raise NoSuchSubmissionError()

    return submission


def submit_solution(user: User, problem_id: int, language_id: int, source_code: File) -> Submission:
    problem = get_problem_by_id(user, problem_id)
    language = get_language_by_id(language_id)

    contest = user.contest
    permitted_langs = list(
        map(lambda lang: lang.id, contest.permitted_languages.all()))
    if language.id not in permitted_langs:
        raise ForbiddenLanguageError()

    sub = Submission(problem=problem,
                     solution_source=source_code,
                     solution_language=language,
                     issuer=user)
    sub.save()
    grade_submission.delay(sub)

    return sub
