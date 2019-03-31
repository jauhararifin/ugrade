class ContestError(Exception):
    def __init__(self, message: str = 'UGrade Error', *args) -> None:
        super(ContestError, self).__init__(message, *args)


class NoSuchContestError(ContestError):
    def __init__(self, message: str = 'No Such Contest') -> None:
        super(NoSuchContestError, self).__init__(message)


class NoSuchUserError(ContestError):
    def __init__(self, message: str = 'No Such User') -> None:
        super(NoSuchUserError, self).__init__(message)


class UserAlreadySignedUpError(ContestError):
    def __init__(self, message: str = 'User Already Signed Up') -> None:
        super(UserAlreadySignedUpError, self).__init__(message)


class UserHaventSignedUpError(ContestError):
    def __init__(self, message: str = 'User Haven\'t Signed Up Yet') -> None:
        super(UserHaventSignedUpError, self).__init__(message)


class AuthenticationError(ContestError):
    def __init__(self, message: str = 'Authentication Error') -> None:
        super(AuthenticationError, self).__init__(message)


class ForbiddenActionError(ContestError):
    def __init__(self, message: str = 'Forbidden Action') -> None:
        super(ForbiddenActionError, self).__init__(message)


class NoSuchProblemError(ContestError):
    def __init__(self, message: str = 'No Such Problem') -> None:
        super(NoSuchProblemError, self).__init__(message)
