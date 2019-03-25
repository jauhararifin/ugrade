import graphene
import contests.schema


class Query(contests.schema.Query, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)
