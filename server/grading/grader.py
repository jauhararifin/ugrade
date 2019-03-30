from django_rq import job


@job
def grade_submission(submission_model):
    print("Grading submission {}".format(submission_model))
