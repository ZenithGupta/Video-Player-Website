from django.urls import path
from . import views
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )
from .views import MyTokenObtainPairView # Import your custom view
from rest_framework_simplejwt.views import TokenRefreshView # Keep TokenRefreshView

urlpatterns = [
    # Pain Assessment Endpoint
    path('submit-assessment/', views.submit_assessment, name='submit_assessment'),

    # Course Data Endpoint
    path('courses/', views.get_courses, name='get_courses'),
    path('courses/<int:pk>/', views.get_course_detail, name='get_course_detail'),
    path('super-courses/', views.get_super_courses, name='get_super_courses'),
    path('super-courses/<int:pk>/', views.get_super_course_detail, name='get_super_course_detail'),

    # --- NEW: URL for fetching user's enrolled courses ---
    path('my-courses/', views.get_my_courses, name='my_courses'),
    path('purchase-history/', views.get_purchase_history, name='get_purchase_history'),

    # User Authentication Endpoints
    path('register/', views.register_user, name='register_user'),
    path('user/', views.get_current_user, name='get_current_user'),
    path('assessment-submitted/', views.get_current_user, name='get_current_user'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'), # Use your custom view
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.LogoutView.as_view(), name='auth_logout'),
    path('health/', views.health_check, name='health_check'),
    path('enroll-free-trial/', views.enroll_free_trial, name='enroll_free_trial'),
    path('create-order/', views.create_order, name='create_order'),
    path('verify-payment/', views.verify_payment, name='verify_payment'),
    path('validate-coupon/', views.validate_coupon, name='validate_coupon'),
]