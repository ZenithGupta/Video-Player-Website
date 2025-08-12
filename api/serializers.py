from rest_framework import serializers
from .models import CustomUser, Course

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model, used for registration.
    """
    class Meta:
        model = CustomUser
        # Fields to be included in the API response.
        fields = ('id', 'email', 'first_name', 'last_name', 'date_of_birth', 'password')
        # Ensures the password is write-only (it won't be sent back in API responses).
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # This method handles creating a new user with a hashed password.
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            date_of_birth=validated_data.get('date_of_birth')
        )
        return user

class CourseSerializer(serializers.ModelSerializer):
    """
    Serializer for the Course model.
    """
    class Meta:
        model = Course
        # Includes all fields from the Course model in the API response.
        fields = '__all__'
