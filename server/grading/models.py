from django.db import models

from contests.models import Submission
from contests.models import User

VERDICT = (
    ('IE', 'Internal Error'),
    ('CE', 'Compilation Error'),
    ('RTE', 'Run Time Error'),
    ('MLE', 'Memory Limit Exceeded'),
    ('TLE', 'Time Limit Exceeded'),
    ('WA', 'Wrong Answer'),
    ('AC', 'Accepted'),
    ('PENDING', 'Pending'),
)


class GradingGroup(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    issued_time = models.DateTimeField(auto_now_add=True)
    verdict = models.CharField(
        max_length=32, choices=VERDICT, default='PENDING')
    finish_time = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return "{} - Grading Group #{}".format(self.submission, self.id)


class Grading(models.Model):
    grading_group = models.ForeignKey(
        GradingGroup, on_delete=models.CASCADE, related_name='gradings')
    issued_time = models.DateTimeField(auto_now_add=True)
    verdict = models.CharField(
        max_length=32, choices=VERDICT, default='PENDING')
    finish_time = models.DateTimeField(blank=True, null=True)
    issuer = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return "{} - Grading #{}".format(self.grading_group, self.id)
