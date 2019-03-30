import jwt

from django.conf import settings

from contests.models import User


def with_me(method):
    def resolve(root, info, *args, **kwargs):
        auth_header = info.context.META.get('HTTP_AUTHORIZATION')
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
                info.context.user = User.objects.get(pk=user_id)
                if info.context.user is None:
                    raise ValueError("Invalid Token")
            except User.DoesNotExist:
                raise ValueError("Invalid Token")
        except Exception:
            raise ValueError("Invalid Token")
        return method(root, info, *args, **kwargs)
    return resolve


def with_permission(permission, message='Forbidden Action'):
    def decorator(method):
        @with_me
        def resolve(root, info, *args, **kwargs):
            my_user = info.context.user
            if my_user.permissions.filter(code=permission).first() is None:
                raise ValueError(message)
            return method(root, info, *args, **kwargs)
        return resolve
    return decorator
