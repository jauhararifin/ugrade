import datetime

import graphene
from graphene.types.datetime import DateTime

from .auth.schemas import AuthQuery, AuthMutation
from .problem.schemas import ProblemQuery, ProblemMutation
from .contest.schema import ContestQuery, ContestMutation
from .submission.schemas import SubmissionQuery, SubmissionMutation


class Query(AuthQuery, ProblemQuery, ContestQuery, SubmissionQuery, graphene.ObjectType):
    clock = DateTime()

    @staticmethod
    def resolve_clock(_root, _info):
        return datetime.datetime.now()


class Mutation(AuthMutation,
               ProblemMutation,
               ContestMutation,
               SubmissionMutation,
               graphene.ObjectType):
    pass
