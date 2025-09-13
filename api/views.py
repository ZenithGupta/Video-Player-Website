from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated # Import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import PainAssessmentSubmission, Course, Video, UserCourse
from .serializers import UserSerializer, CourseSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer # Import your new serializer
from .permissions import HasGoogleAppsScriptSecret

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# --- User Authentication Views ---

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Handles new user registration.
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response(
                {'email': ['An account with this email already exists.']},
                status=status.HTTP_400_BAD_REQUEST
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- New view to get the current user ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Fetches and returns the currently authenticated user's data.
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)



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

@api_view(['GET'])
@permission_classes([AllowAny])
def get_course_detail(request, pk):
    """
    Fetches and returns a single course by its ID.
    """
    try:
        course = Course.objects.get(pk=pk)
        serializer = CourseSerializer(course)
        return Response(serializer.data)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    
# --- NEW: View to get enrolled courses for the current user ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_courses(request):
    """
    Fetches and returns a list of courses the current user is enrolled in.
    """
    user = request.user
    # Find all UserCourse entries for this user
    user_courses = UserCourse.objects.filter(user=user)
    # Extract the actual Course objects from those entries
    courses = [uc.course for uc in user_courses]
    # Serialize the course data
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# --- Pain Assessment View ---
# This view remains the same.

@api_view(['POST'])
@permission_classes([HasGoogleAppsScriptSecret])
@csrf_exempt
def submit_assessment(request):
    """
    Receives pain assessment data from the Google Form and saves it.
    """
    data = request.data
    
    try:
        # --- This is the corrected and complete create() call ---
        submission = PainAssessmentSubmission.objects.create(
            pain_level=data.get('pain_level'),
            rising_pain=data.get('rising_pain'),
            standing_duration=data.get('standing_duration'),
            can_climb_stairs=data.get('can_climb_stairs'),
            descending_stairs_pain=data.get('descending_stairs_pain'),
            walking_distance=data.get('walking_distance'),
            knee_bend_ability=data.get('knee_bend_ability'),
            can_sit_on_floor=data.get('can_sit_on_floor'),
            stand_from_chair_ability=data.get('stand_from_chair_ability'),
            joint_stiffness=data.get('joint_stiffness'),
            limp_while_walking=data.get('limp_while_walking'),
            can_bend_fully=data.get('can_bend_fully'),
            stand_on_one_leg_duration=data.get('stand_on_one_leg_duration')
        )
        return Response({'message': 'Submission received successfully!'}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        # Log the error for better debugging
        print(f"Error saving submission: {e}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)