import graphene

from .auth.schemas import AuthQuery, AuthMutation
from .problem.schemas import ProblemQuery, ProblemMutation
from .contest.schema import ContestQuery, ContestMutation
from .submission.schemas import SubmissionQuery, SubmissionMutation
from .status.schemas import StatusQuery


class Query(AuthQuery,
            ProblemQuery,
            ContestQuery,
            SubmissionQuery,
            StatusQuery,
            graphene.ObjectType):
    pass


class Mutation(AuthMutation,
               ProblemMutation,
               ContestMutation,
               SubmissionMutation,
               graphene.ObjectType):
    pass
