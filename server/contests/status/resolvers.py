import datetime


def ping_resolver(_root, _info) -> str:
    return 'pong'


def server_clock_resolver(_root, _info) -> datetime.datetime:
    return datetime.datetime.now()
