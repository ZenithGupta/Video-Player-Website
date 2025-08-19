from rest_framework import serializers
from .models import User, Course, Playlist, Video, UserCourse

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'date_of_birth', 'gender')
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            date_of_birth=validated_data.get('date_of_birth'),
            gender=validated_data.get('gender')
        )
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

class CourseSerializer(serializers.ModelSerializer):
    playlists = PlaylistSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

class UserCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCourse
        fields = '__all__'