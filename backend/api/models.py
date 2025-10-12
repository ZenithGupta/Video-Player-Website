from django.contrib.auth.models import AbstractUser, Group, Permission, BaseUserManager
from django.db import models
from django.utils import timezone
from datetime import timedelta

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female'), ('O', 'Other')]
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()
    groups = models.ManyToManyField(Group, verbose_name='groups', blank=True, related_name="api_user_set", related_query_name="user")
    user_permissions = models.ManyToManyField(Permission, verbose_name='user permissions', blank=True, related_name="api_user_permissions_set", related_query_name="user")

class Video(models.Model):
    CATEGORY_CHOICES = [
        ('Pain Relief', 'Pain Relief'),
        ('Strength Training', 'Strength Training'),
        ('Mobility & Flexibility', 'Mobility & Flexibility'),
        ('Posture Correction', 'Posture Correction'),
        ('Sports Injury', 'Sports Injury'),
    ]
    title = models.CharField(max_length=200, default='')
    instructor = models.CharField(max_length=100, default='')
    description = models.TextField(blank=True)
    vimeo_url = models.URLField(max_length=500)
    image = models.URLField(max_length=500)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Pain Relief')
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    def __str__(self):
        return self.title

class SuperCourse(models.Model):
    title = models.CharField(max_length=200, default='')
    bestseller = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Course(models.Model):
    super_course = models.ForeignKey(SuperCourse, related_name='courses', on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=200, default='')
    validity_weeks = models.IntegerField(default=5)
    bestseller = models.BooleanField(default=False)
    price = models.CharField(max_length=20, default="0")
    def __str__(self):
        return self.title

class Playlist(models.Model):
    title = models.CharField(max_length=200, default='')
    videos = models.ManyToManyField(Video, blank=True)
    def __str__(self):
        return self.title

class Week(models.Model):
    title = models.CharField(max_length=200, default='')
    week_number = models.IntegerField()
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, null=True, blank=True)
    class Meta:
        ordering = ['week_number']
    def __str__(self):
        return f"{self.title} (Week {self.week_number})"

class Phase(models.Model):
    title = models.CharField(max_length=200, default='')
    course = models.ForeignKey(Course, related_name='phases', on_delete=models.CASCADE)
    weeks = models.ManyToManyField(Week)
    phase_number = models.IntegerField(default=1)
    class Meta:
        ordering = ['phase_number']
    def __str__(self):
        return f"{self.title} (Phase {self.phase_number} of {self.course.title})"

# ... rest of the models ...
class UserCourse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField()
    current_phase = models.ForeignKey(Phase, on_delete=models.SET_NULL, null=True, blank=True)
    def save(self, *args, **kwargs):
        if not self.id:
            self.end_time = timezone.now() + timedelta(weeks=self.course.validity_weeks)
        super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.user.email} - {self.course.title}"

class PainAssessmentSubmission(models.Model):
    pain_level = models.IntegerField(help_text="Question 1: Current level of pain")
    rising_pain = models.IntegerField(help_text="Question 2: Pain when rising from a seated position")
    standing_duration = models.IntegerField(help_text="Question 3: How long can you stand without pain?")
    can_climb_stairs = models.IntegerField(help_text="Question 4: Can you climb stairs?")
    descending_stairs_pain = models.IntegerField(help_text="Question 5: Pain while descending stairs")
    walking_distance = models.IntegerField(help_text="Question 6: How far can you walk?")
    knee_bend_ability = models.IntegerField(help_text="Question 7: Can you fully bend your knees?")
    can_sit_on_floor = models.IntegerField(help_text="Question 8: Can you sit on the floor?")
    stand_from_chair_ability = models.IntegerField(help_text="Question 9: Can you stand from a chair without support?")
    joint_stiffness = models.IntegerField(help_text="Question 10: Do your joints feel stiff?")
    limp_while_walking = models.IntegerField(help_text="Question 11: Do you lean or limp while walking?")
    can_bend_fully = models.IntegerField(help_text="Question 12: Can you bend down fully?")
    stand_on_one_leg_duration = models.IntegerField(help_text="Question 13: How long can you stand on one leg?")
    submitted_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Submission from {self.submitted_at.strftime('%Y-%m-%d %H:%M')}"