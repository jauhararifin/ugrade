import os
import tarfile
import tempfile

from django.core.files import File
from django.db import transaction
from django_rq import job

from .models import GradingGroup


def pack_spec(submission_model):
    problem = submission_model.problem

    # create tar file temporarily
    fd, tar_path = tempfile.mkstemp()
    os.close(fd)

    # define files to be added, and their target name
    files = [
        (problem.tcgen_source, 'tcgen'),
        (problem.solution_source, 'solution'),
        (problem.checker_source, 'checker'),
        (submission_model.solution_source, 'submission'),
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

    return tar_path


@job
@transaction.atomic
def grade_submission(submission_model):
    problem = submission_model.problem
    contest = problem.contest

    # create grading group
    ggroup = GradingGroup(submission=submission_model,
                          verdict='PENDING',
                          grading_size=contest.grading_size)
    ggroup.save()

    # add spec file
    tar_path = pack_spec(submission_model)
    with open(tar_path, 'r') as tar_file:
        ggroup.spec.save('spec', File(tar_file))
    os.remove(tar_path)
