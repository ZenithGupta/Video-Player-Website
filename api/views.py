from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import PainAssessmentSubmission

@csrf_exempt # Add this decorator to allow requests from Google Apps Script
@api_view(['POST'])
def submit_assessment(request):
    """
    Receives pain assessment data from the Google Form and saves it.
    """
    data = request.data
    
    try:
        # Create a new submission object from the incoming data
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
        # Send a success response back
        return Response({'message': 'Submission received successfully!'}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        # If there's an error, send a bad request response
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

