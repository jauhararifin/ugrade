from django.http import HttpResponse

from contests.auth.core import get_me


def get_job(request):
    try:
        me = get_me(request)
        return HttpResponse("You're looking for job ey " + str(me))
    except Exception as e:
        return HttpResponse(e, status=500)
