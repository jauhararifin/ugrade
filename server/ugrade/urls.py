from django.contrib import admin
from django.conf.urls import url, include
from django.urls import path
from django.views.static import serve

from ugrade import settings
from ugrade.schema import schema
from contests.views import ContestView

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^graphql', ContestView.as_view(graphiql=True, schema=schema)),
    url(r'^storages/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT
    }),
    path('django-rq/', include('django_rq.urls')),
    path('gradings/', include('grading.urls')),
]
