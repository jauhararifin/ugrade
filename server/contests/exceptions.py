class ContestError(Exception):
    def __init__(self, message: str = 'UGrade Error', *args) -> None:
        super(Exception, self).__init__(message, *args)


class NoSuchContestError(ContestError):
    def __init__(self, message: str = 'No Such Contest') -> None:
        super(ContestError, self).__init__(message)


class NoSuchUserError(ContestError):
    def __init__(self, message: str = 'No Such User') -> None:
        super(ContestError, self).__init__(message)


class UserAlreadySignedUpError(ContestError):
    def __init__(self, message: str = 'User Already Signed Up') -> None:
        super(ContestError, self).__init__(message)


class UserHaventSignedUpError(ContestError):
    def __init__(self, message: str = 'User Haven\'t Signed Up Yet') -> None:
        super(ContestError, self).__init__(message)


class AuthenticationError(ContestError):
    def __init__(self, message: str = 'Authentication Error') -> None:
        super(ContestError, self).__init__(message)


class ForbiddenActionError(ContestError):
    def __init__(self, message: str = 'Forbidden Action') -> None:
        super(ContestError, self).__init__(message)
