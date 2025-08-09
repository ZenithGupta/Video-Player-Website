from django.urls import path
from . import views

urlpatterns = [
    path('submit-assessment/', views.submit_assessment, name='submit_assessment'),
]