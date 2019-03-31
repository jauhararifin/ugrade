from django.http import HttpResponse
from django.views import View

from contests.auth.core import get_me
from .grader import get_grading_job, submit_grading_job


class JobView(View):

    # search open job
    def get(self, request):
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

    # submit job result
    def post(self, request):
        try:
            output_file = request.FILES['output']
            job_token = request.META.get('HTTP_X_JOB_TOKEN')
            verdict = request.POST['verdict']
            submit_grading_job(job_token, verdict, output_file)
            return HttpResponse('OK', status=200)
        except ValueError as err:
            return HttpResponse(err, status=500)
