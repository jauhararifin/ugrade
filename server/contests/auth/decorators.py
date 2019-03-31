from contests.auth.core import get_me
from contests.exceptions import ForbiddenActionError


def with_me(method):
    def resolve(root, info, *args, **kwargs):
        info.context.user = get_me(info.context)
        return method(root, info, *args, **kwargs)
    return resolve


def with_permission(permission, message='Forbidden Action'):
    def decorator(method):
        @with_me
        def resolve(root, info, *args, **kwargs):
            my_user = info.context.user
            if my_user.permissions.filter(code=permission).first() is None:
                raise ForbiddenActionError(message)
            return method(root, info, *args, **kwargs)
        return resolve
    return decorator
