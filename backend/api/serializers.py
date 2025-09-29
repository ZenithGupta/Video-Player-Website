from rest_framework import serializers
from .models import User, Course, Week, Video, UserCourse, Phase, Playlist, SuperCourse
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['full_name'] = user.get_full_name()
        token['username'] = user.username
        return token

class UserCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCourse
        fields = ('course', 'end_time', 'current_phase')

class UserSerializer(serializers.ModelSerializer):
    usercourse_set = UserCourseSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password', 'date_of_birth', 'gender', 'usercourse_set')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'

class PlaylistSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)
    class Meta:
        model = Playlist
        fields = '__all__'

class WeekSerializer(serializers.ModelSerializer):
    playlist = PlaylistSerializer(read_only=True)
    class Meta:
        model = Week
        fields = '__all__'

class PhaseSerializer(serializers.ModelSerializer):
    weeks = WeekSerializer(many=True, read_only=True)
    class Meta:
        model = Phase
        fields = ('id', 'title', 'weeks', 'phase_number') # Ensure 'id' is here

class CourseSerializer(serializers.ModelSerializer):
    phases = PhaseSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = '__all__'

class SuperCourseSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    class Meta:
        model = SuperCourse
        fields = '__all__'