import graphene
from graphene_django.types import DjangoObjectType

from django.db import transaction
from django.db.models import Max

from contests.models import Problem
from contests.auth.decorators import with_permission


class ProblemType(DjangoObjectType):
    class Meta:
        model = Problem
        only_fields = ('id', 'short_id', 'name', 'statement', 'contest', 'disabled',
                       'order', 'time_limit', 'tolerance', 'memory_limit', 'output_limit')


class ProblemInput(graphene.InputObjectType):
    short_id = graphene.String(required=True)
    name = graphene.String(required=True)
    statement = graphene.String(required=True)
    disabled = graphene.Boolean(required=True)
    time_limit = graphene.Int(required=True)
    tolerance = graphene.Float(required=True)
    memory_limit = graphene.Int(required=True)
    output_limit = graphene.Int(required=True)


class CreateProblem(graphene.Mutation):
    class Arguments:
        problem = ProblemInput(required=True)

    Output = ProblemType

    @staticmethod
    @transaction.atomic
    @with_permission('create:problems', "You Don't Have Permission To Create Problem")
    def mutate(_root, info, problem):
        user = info.context.user
        last_order = Problem.objects.filter(
            contest__id=user.contest.id).aggregate(Max('order'))
        new_prob = Problem(
            **problem, order=last_order['order__max'] + 1, contest=user.contest)
        new_prob.save()
        return new_prob


class UpdateProblem(graphene.Mutation):
    class Arguments:
        problem_id = graphene.String(required=True)
        problem = ProblemInput(required=True)

    Output = ProblemType

    @staticmethod
    @with_permission('update:problems', "You Don't Have Permission To Update Problem")
    def mutate(_root, info, problem_id, problem):
        user = info.context.user
        try:
            prob = Problem.objects.get(pk=problem_id)
        except Problem.DoesNotExist:
            raise ValueError("No Such Problem")

        permissions = map(lambda user: user.code, user.permissions.all())
        if prob.disabled and 'read:disabledProblems' not in permissions:
            raise ValueError("No Such Problem")
        for k in problem:
            setattr(prob, k, problem[k])
        prob.save()
        return prob


class DeleteProblem(graphene.Mutation):
    class Arguments:
        problem_id = graphene.String(required=True)

    Output = graphene.String

    @staticmethod
    @with_permission('delete:problems', "You Don't Have Permission To Delete Problem")
    def mutate(_root, info, problem_id):
        user = info.context.user
        try:
            prob = Problem.objects.get(pk=problem_id)
        except Problem.DoesNotExist:
            raise ValueError("No Such Problem")
        permissions = map(lambda user: user.code, user.permissions.all())
        if prob.disabled and 'read:disabledProblems' not in permissions:
            raise ValueError("No Such Problem")
        prob.delete()
        return problem_id
