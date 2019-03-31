from django.urls import path

from .views import JobView

urlpatterns = [
    path('jobs/', JobView.as_view(), name='jobs'),
]
