from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import PainAssessmentSubmission, Course 
from .serializers import UserSerializer, CourseSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError # Import IntegrityError

# --- User Authentication Views ---

@api_view(['POST'])
@permission_classes([AllowAny]) # Allows anyone to access this view
def register_user(request):
    """
    Handles new user registration.
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            # Generate JWT tokens for the new user
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        except IntegrityError:
            # This will now catch the duplicate email/username error
            return Response(
                {'email': ['An account with this email already exists.']}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # If the initial data is invalid, return the serializer's errors.
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Note: Login is handled by Simple JWT's built-in TokenObtainPairView,
# which we will add to urls.py. No custom view is needed.


# --- Course Data View ---

@api_view(['GET'])
@permission_classes([AllowAny])
def get_courses(request):
    """
    Fetches and returns the list of all courses.
    """
    courses = Course.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# --- Pain Assessment View ---
# This view remains the same.

@csrf_exempt
@api_view(['POST'])
def submit_assessment(request):
    """
    Receives pain assessment data from the Google Form and saves it.
    """
    data = request.data
    
    try:
        submission = PainAssessmentSubmission.objects.create(
            pain_level=data.get('pain_level'),
            rising_pain=data.get('rising_pain'),
            # ... (all other fields remain the same)
            stand_on_one_leg_duration=data.get('stand_on_one_leg_duration')
        )
        return Response({'message': 'Submission received successfully!'}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)