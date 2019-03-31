import datetime
import graphene

from .core import get_server_clock, ping


def ping_resolver(_root, _info) -> str:
    return ping()


def server_clock_resolver(_root, _info) -> datetime.datetime:
    return get_server_clock()


class StatusQuery():
    server_clock = graphene.DateTime(
        required=True, resolver=server_clock_resolver)
    ping = graphene.String(required=True, resolver=ping_resolver)
