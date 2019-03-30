import jwt

from django.conf import settings
from contests.models import User


def get_me(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if auth_header is None:
        raise ValueError("Missing Token")

    partition = auth_header.split()
    if len(partition) != 2 or partition[0].lower() != 'bearer':
        raise ValueError('Invalid Token')

    token = partition[1]
    try:
        data = jwt.decode(token, settings.SECRET_KEY, algorithm=['HS256'])
        user_id = data['id']
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise ValueError("Invalid Token")
    except Exception:
        raise ValueError("Invalid Token")
