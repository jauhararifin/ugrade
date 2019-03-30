import os
import tarfile
import tempfile

from django.core.files import File
from django.db import transaction
from django_rq import job

from .models import GradingGroup


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
        insert_spec(ggroup)
    except:
        ggroup.verdict = 'IE'
        ggroup.save()
