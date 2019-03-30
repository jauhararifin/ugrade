from django.urls import path

from .views import get_job

urlpatterns = [
    path('jobs/', get_job, name='jobs'),
]
