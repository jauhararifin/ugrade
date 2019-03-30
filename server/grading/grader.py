import datetime
import os
import tarfile
import tempfile

import jwt

from django.conf import settings
from django.core.files import File
from django.db import transaction
from django_rq import job

from .models import GradingGroup, Grading


def insert_spec(grading_group):
    submission = grading_group.submission
    problem = submission.problem

    # create tar file temporarily
    fd, tar_path = tempfile.mkstemp()
    os.close(fd)

    # define files to be added, and their target name
    files = [
        (problem.tcgen_source, 'tcgen'),
        (problem.solution_source, 'solution'),
        (problem.checker_source, 'checker'),
        (submission.solution_source, 'submission'),
    ]

    # add files to tar
    spec = tarfile.open(tar_path, 'w')
    for f, arcname in files:
        ext = os.path.splitext(f.name)[1]
        with f.open() as source:
            fd, filename = tempfile.mkstemp()
            os.close(fd)
            with open(filename, 'wb') as dest:
                for chunk in source.chunks():
                    dest.write(chunk)
            spec.add(filename, arcname + ext)
            os.remove(filename)
    spec.close()

    with open(tar_path, 'r') as tar_file:
        grading_group.spec.save('spec.tar', File(tar_file))
    os.remove(tar_path)


@job
@transaction.atomic
def grade_submission(submission_model):
    problem = submission_model.problem
    contest = problem.contest

    ggroup = GradingGroup(submission=submission_model,
                          verdict='PENDING',
                          grading_size=contest.grading_size)
    ggroup.save()

    try:
        # create spec file as tar
        insert_spec(ggroup)

        # create `grading_size` jobs
        for i in range(contest.grading_size):
            grading = Grading(grading_group=ggroup, contest=contest,
                              verdict='Pending', grader_group=i)
            grading.save()

    except Exception:
        ggroup.verdict = 'IE'
        ggroup.save()


def hash_id(user_id):
    return ((((user_id + 29) * 31) + 91) * 929)

# return job token and field file containing spec
@transaction.atomic
def get_grading_job(user):
    # compute grader group
    contest = user.contest
    grading_size = contest.grading_size
    hashed_id = hash_id(user.id)
    grader_group = hashed_id % grading_size

    # find open job in current contest, using grader_group
    grading_job = Grading.objects.filter(
        contest=contest, grader_group=grader_group, claimed_by=None).first()
    if grading_job is None:
        return None, None
    spec = grading_job.grading_group.spec

    # generate job token
    job_token = jwt.encode({'gradingId': grading_job.id, 'userId': user.id, },
                           settings.SECRET_KEY, algorithm='HS256').decode("utf-8")

    # mark job as claimed
    grading_job.claimed_by = user
    grading_job.claimed_at = datetime.datetime.now()
    grading_job.save()

    return job_token, spec
