import json
import os
import tarfile
import tempfile

import jwt

from django.utils import timezone
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

    fd, lang_info_path = tempfile.mkstemp()
    os.close(fd)
    language_info = {
        'tcgen': str(problem.tcgen_language.id),
        'solution': str(problem.solution_language.id),
        'checker': str(problem.checker_language.id),
        'submission': str(submission.solution_language.id),
    }
    with open(lang_info_path, 'w') as lang_info_file:
        json.dump(language_info, lang_info_file)
    spec.add(lang_info_path, 'lang.json')
    os.remove(lang_info_path)

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
                              verdict='PENDING', grader_group=i)
            grading.save()

    except:
        ggroup.verdict = 'IE'
        ggroup.save()


# return job token and field file containing spec
@transaction.atomic
def get_grading_job(user):
    # hash function for hashing user_id
    def hash_id(user_id):
        return (((user_id + 29) * 31) + 91) * 929

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
    grading_job.claimed_at = timezone.now()
    grading_job.save()

    return job_token, spec


@transaction.atomic
def submit_grading_job(token, verdict, output):
    try:
        data = jwt.decode(token, settings.SECRET_KEY, algorithm=['HS256'])
        user_id = data['userId']
        job_id = data['gradingId']
        if user_id is None or job_id is None:
            raise ValueError('Invalid Token')
    except Exception:
        raise ValueError('Invalid Token')

    grading = Grading.objects.get(pk=job_id)
    if grading.claimed_by.id != user_id:
        raise ValueError('Invalid Token')

    if grading.finish_at is not None:
        raise ValueError('You Have Submitted This Job')

    grading.finish_at = timezone.now()
    grading.verdict = verdict
    grading.output = output
    grading.save()

    # calculate verdict found in gradings.
    grading_group = grading.grading_group
    grading_size = grading_group.grading_size
    gradings = Grading.objects.filter(grading_group=grading_group).all()
    accepted_count = 0
    job_finished = 0
    verdict_set = set()
    for grad in gradings:
        if grad.finish_at is not None:
            job_finished += 1
        if grad.verdict == 'AC':
            accepted_count += 1
        verdict_set.add(grad.verdict)

    # check whether grading group is finished
    if job_finished == grading_size:
        grading_group.finish_time = timezone.now()
        if accepted_count >= (grading_size + 1) // 2:
            grading_group.verdict = 'AC'
        else:
            verdict_order = ['RTE', 'MLE', 'TLE', 'WA', 'CE']
            found = False
            for verd in verdict_order:
                if verd in verdict_set:
                    grading_group.verdict = verd
                    found = True
                    break
            if not found:
                grading_group.verdict = 'IE'
        grading_group.save()
