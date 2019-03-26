from django.contrib import admin
from django.conf.urls import url
from django.urls import path
from ugrade.schema import schema
from contests.views import ContestView

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^graphql', ContestView.as_view(graphiql=True, schema=schema)),
]
