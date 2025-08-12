from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Pain Assessment Endpoint
    path('submit-assessment/', views.submit_assessment, name='submit_assessment'),

    # Course Data Endpoint
    path('courses/', views.get_courses, name='get_courses'),

    # User Authentication Endpoints
    path('register/', views.register_user, name='register_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # For Login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
