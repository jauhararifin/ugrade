from django.http import HttpResponse

from contests.auth.core import get_me
from .grader import get_grading_job


def get_job(request):
    try:
        my_user = get_me(request)
        job_token, spec = get_grading_job(my_user)

        if spec is None:
            return HttpResponse('No Job', status=404)

        filename = spec.name.split('/')[-1]
        response = HttpResponse(spec, content_type='text/plain')
        response['Content-Disposition'] = 'attachment; filename="%s"' % filename
        response['X-JOB-TOKEN'] = job_token

        return response
    except ValueError as err:
        return HttpResponse(err, status=500)
