from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated # Import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import PainAssessmentSubmission, Course, Video, UserCourse, SuperCourse, User
from .serializers import UserSerializer, CourseSerializer, SuperCourseSerializer
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
    Fetches and returns the list of all courses that are not part of a super course.
    """
    courses = Course.objects.filter(super_course__isnull=True, is_free_trial=False)
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

@api_view(['GET'])
@permission_classes([AllowAny])
def get_super_courses(request):
    """
    Fetches and returns the list of all super courses.
    """
    super_courses = SuperCourse.objects.all()
    serializer = SuperCourseSerializer(super_courses, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_super_course_detail(request, pk):
    """
    Fetches and returns a single super course by its ID.
    """
    try:
        super_course = SuperCourse.objects.get(pk=pk)
        serializer = SuperCourseSerializer(super_course)
        return Response(serializer.data)
    except SuperCourse.DoesNotExist:
        return Response({'error': 'Super Course not found'}, status=status.HTTP_404_NOT_FOUND)
    
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_free_trial(request):
    """
    Enroll the authenticated user into the Knee Pain Recovery Program (free trial course).
    Finds the SuperCourse titled 'Knee Pain Recovery Program' and enrolls into its first child course.
    """
    user = request.user
    try:
        sc = SuperCourse.objects.filter(title__icontains='Knee Pain Recovery Program').first()
        if not sc:
            # Fallback: choose any available course
            course = Course.objects.first()
        else:
            course = sc.courses.first()

        if not course:
            return Response({'error': 'No course available to enroll'}, status=status.HTTP_404_NOT_FOUND)

        # Prevent duplicate enrollment
        existing = UserCourse.objects.filter(user=user, course=course).first()
        if existing:
            return Response({'course_id': course.id, 'message': 'Already enrolled'}, status=status.HTTP_200_OK)

        uc = UserCourse.objects.create(user=user, course=course)
        return Response({'course_id': course.id, 'message': 'Enrolled successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

import razorpay
from django.conf import settings


# --- Razorpay Payment Views ---

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """
    Creates a Razorpay order.
    Expects 'course_id'.
    """
    user = request.user
    data = request.data
    course_id = data.get('course_id')

    if not course_id:
        return Response({'error': 'Course ID required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        course = Course.objects.get(pk=course_id)
        # Assuming price is stored as string/integer in rupees. Convert to paise.
        amount = int(float(course.price) * 100)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    except ValueError:
        return Response({'error': 'Invalid Course Price'}, status=status.HTTP_400_BAD_REQUEST)

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    
    payment_data = {
        'amount': amount,
        'currency': 'INR',
        'receipt': f'receipt_{user.id}_{course_id}',
        'notes': {
            'user_id': user.id,
            'course_id': course_id
        }
    }
    
    try:
        order = client.order.create(data=payment_data)
        # Return key_id as well for frontend
        response_data = order
        response_data['key_id'] = settings.RAZORPAY_KEY_ID
        return Response(response_data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """
    Verifies Razorpay payment signature and enrolls user.
    """
    data = request.data
    razorpay_order_id = data.get('razorpay_order_id')
    razorpay_payment_id = data.get('razorpay_payment_id')
    razorpay_signature = data.get('razorpay_signature')
    course_id = data.get('course_id')

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    try:
        # Verify signature
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        client.utility.verify_payment_signature(params_dict)

        # Enrollment Logic
        user = request.user
        course = Course.objects.get(pk=course_id)
        
        if not UserCourse.objects.filter(user=user, course=course).exists():
            UserCourse.objects.create(user=user, course=course)
            
        return Response({'message': 'Payment successful', 'course_id': course.id}, status=status.HTTP_200_OK)

    except razorpay.errors.SignatureVerificationError:
        return Response({'error': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)
    except Course.DoesNotExist:
         return Response({'error': 'Course not found'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
        # Try to resolve a user if the payload includes an identifier
        user_obj = None
        user_email = data.get('user_email') or data.get('email')
        user_id = data.get('user_id')
        if user_email:
            try:
                user_obj = User.objects.filter(email__iexact=user_email).first()
            except Exception:
                user_obj = None
        elif user_id:
            try:
                user_obj = User.objects.filter(id=user_id).first()
            except Exception:
                user_obj = None
        # If we found a user, check if they already have a submission (or flag)
        if user_obj:
            if user_obj.assessment_submitted:
                return Response({'error': 'User has already submitted assessment.'}, status=status.HTTP_409_CONFLICT)

        # Create the submission and associate with the user if found
        submission = PainAssessmentSubmission.objects.create(
            user=user_obj,
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

        # If we have a user, mark them as having submitted the assessment and enroll them
        course_id = None
        if user_obj:
            try:
                user_obj.assessment_submitted = True
                user_obj.save()

                # Calculate Mode pain score (most frequent value)
                fields = [
                    'pain_level', 'rising_pain', 'standing_duration', 'can_climb_stairs',
                    'descending_stairs_pain', 'walking_distance', 'knee_bend_ability',
                    'can_sit_on_floor', 'stand_from_chair_ability', 'joint_stiffness',
                    'limp_while_walking', 'can_bend_fully', 'stand_on_one_leg_duration'
                ]
                
                valid_scores = []
                for field in fields:
                    val = data.get(field)
                    if val is not None:
                        try:
                            valid_scores.append(int(val))
                        except (ValueError, TypeError):
                            pass
                
                # Calculate Mode
                if not valid_scores:
                    mode_score = 1
                else:
                    from collections import Counter
                    c = Counter(valid_scores)
                    # c.most_common() returns a list of (value, count) sorted by count descending.
                    # If multiple have the same count, we want to pick the highest score (conservative approach for pain)
                    # So we get all max frequency items
                    max_freq = c.most_common(1)[0][1]
                    modes = [val for val, count in c.items() if count == max_freq]
                    mode_score = max(modes) # Pick highest value among modes

                # Use the mode for course assignment
                search_score = mode_score
                if search_score > 3:
                     search_score = 3
                if search_score < 1:
                     search_score = 1
                
                course = Course.objects.filter(is_free_trial=True, average_pain_score=search_score).first()
                if not course:
                    # Fallback: try to find any free trial course, preferably lowest score
                    course = Course.objects.filter(is_free_trial=True).order_by('average_pain_score').first()

                if course:
                    # create UserCourse if not exists
                    existing = UserCourse.objects.filter(user=user_obj, course=course).first()
                    if not existing:
                        UserCourse.objects.create(user=user_obj, course=course)
                    course_id = course.id
            except Exception as e:
                # Don't fail the whole request if enrollment or flagging fails; just continue
                print('Warning: could not mark user or enroll:', e)

        return Response({'message': 'Submission received successfully!', 'course_id': course_id}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        # Log the error for better debugging
        print(f"Error saving submission: {e}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
# ---- Health Check endpoint -----
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Simple health check endpoint for load balancers
    """
    return Response({'status': 'healthy'}, status=status.HTTP_200_OK)