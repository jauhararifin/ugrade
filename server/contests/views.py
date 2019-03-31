from django.core.exceptions import ValidationError
from graphene_django.views import GraphQLView
from graphene_file_upload.django import FileUploadGraphQLView

from graphql import GraphQLError
from graphql.error import format_error as format_graphql_error

from .exceptions import ContestError


class ContestView(FileUploadGraphQLView):
    @staticmethod
    def format_error(error):
        if hasattr(error, 'original_error'):
            original_error = error.original_error
            if isinstance(original_error, ValidationError):
                err_dict = original_error.message_dict

                def to_camel(strs):
                    components = strs.split('_')
                    return components[0] + ''.join(x.title() for x in components[1:])

                err_dict = {to_camel(k): err_dict[k] for k in err_dict}

                return {
                    "code": "InvalidInput",
                    "message": "Invalid User Input",
                    "validations": err_dict
                }

            if isinstance(original_error, ContestError):
                returned_err = {
                    'code': original_error.__class__.__name__,
                    'message': original_error.args[0],
                }
                if len(original_error.args) > 1:
                    returned_err['extensions'] = original_error.args[1:]
                return returned_err

            return {
                'code': 'Internal Server Error',
                'message': 'Internal Server Error',
            }

        return GraphQLView.format_error(error)
