from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Course

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('date_of_birth',)

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'profile')
        # This is the crucial change:
        # It makes 'username' a read-only field during validation, as we create it manually.
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True} 
        }

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        # We use the email as the username to ensure it's unique for website logins.
        user = User.objects.create_user(
            username=validated_data['email'], 
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        Profile.objects.create(user=user, **profile_data)
        return user

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
