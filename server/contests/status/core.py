import datetime


def get_server_clock() -> datetime.datetime:
    return datetime.datetime.now()


def ping() -> str:
    return 'pong'
