import os
import tarfile

from django.db import transaction
from django_rq import job

from .models import GradingGroup


@job
@transaction.atomic
def grade_submission(submission_model):
    problem = submission_model.problem
    contest = problem.contest

    # Packing tar files
    spec = tarfile.open('spec.tar', 'w')

    file = problem.tcgen_source
    tarinfo = tarfile.TarInfo('storages/' + file.name)
    tarinfo.size = file.size
    spec.addfile(tarinfo, file.open('rb'))
    print(file, tarinfo, tarinfo.size)

    file = problem.solution_source
    tarinfo = tarfile.TarInfo('storages/' + file.name)
    tarinfo.size = file.size
    spec.addfile(tarinfo, file.open('rb'))
    print(file, tarinfo, tarinfo.size)

    file = problem.checker_source
    tarinfo = tarfile.TarInfo('storages/' + file.name)
    tarinfo.size = file.size
    spec.addfile(tarinfo, file.open('rb'))
    print(file, tarinfo, tarinfo.size)

    file = submission_model.solution_source
    tarinfo = tarfile.TarInfo('storages/' + file.name)
    tarinfo.size = file.size
    spec.addfile(tarinfo, file.open('rb'))
    print(file, tarinfo, tarinfo.size)
    spec.close()

    ggroup = GradingGroup(submission=submission_model,
                          verdict='PENDING',
                          grading_size=contest.grading_size)

    ggroup.save()

    print("Grading submission {}".format(submission_model))
