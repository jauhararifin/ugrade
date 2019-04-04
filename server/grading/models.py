import os
import random

from django.db import models

from contests.models import Submission, User, Contest

VERDICT = (
    ('RTE', 'Run Time Error'),
    ('MLE', 'Memory Limit Exceeded'),
    ('TLE', 'Time Limit Exceeded'),
    ('WA', 'Wrong Answer'),
    ('CE', 'Compilation Error'),
    ('IE', 'Internal Error'),
    ('AC', 'Accepted'),
    ('PENDING', 'Pending'),
)


def spec_upload_path(instance, filename):
    alphanum = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    random_str = ''.join(random.choice(alphanum) for _ in range(64))
    return os.path.join("{}-{}-{}".format('gradingspec', instance.id, random_str), filename)


class GradingGroup(models.Model):
    submission = models.ForeignKey(
        Submission, on_delete=models.CASCADE, related_name='grading_groups')
    issued_time = models.DateTimeField(auto_now_add=True)
    verdict = models.CharField(
        max_length=32, choices=VERDICT, default='PENDING')
    finish_time = models.DateTimeField(blank=True, null=True)

    # contain tcgen solution checker submission
    spec = models.FileField(upload_to=spec_upload_path)
    grading_size = models.IntegerField()

    def __str__(self):
        return "{} - Grading Group #{}".format(self.submission, self.id)


class Grading(models.Model):
    # filled when inserted
    grading_group = models.ForeignKey(
        GradingGroup, on_delete=models.CASCADE, related_name='gradings')
    # for optimization
    contest = models.ForeignKey(
        Contest, on_delete=models.CASCADE, related_name='gradings')
    verdict = models.CharField(
        max_length=32, choices=VERDICT, default='PENDING')
    grader_group = models.IntegerField()

    # filled when claimed
    claimed_at = models.DateTimeField(blank=True, null=True)
    claimed_by = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL)

    # filled when finished
    finish_at = models.DateTimeField(blank=True, null=True)
    output = models.FileField(null=True, blank=True)

    def __str__(self):
        return "{} - Grading #{}".format(self.grading_group, self.id)
