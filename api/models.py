from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission, User
from django.utils.translation import gettext_lazy as _

# --- Profile Model ---
# This model is linked to Django's default User model and stores extra info.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.username

# --- Course/Video Model ---
# This model remains the same.
class Course(models.Model):
    CATEGORY_CHOICES = [
        ('Pain Relief', 'Pain Relief'),
        ('Strength Training', 'Strength Training'),
        ('Mobility & Flexibility', 'Mobility & Flexibility'),
        ('Posture Correction', 'Posture Correction'),
        ('Sports Injury', 'Sports Injury'),
    ]

    title = models.CharField(max_length=200)
    instructor = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    vimeo_id = models.CharField(max_length=50)
    image = models.URLField(max_length=500)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    reviews = models.IntegerField()
    price = models.CharField(max_length=20)
    bestseller = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
# --- Pain Assessment Model ---
# This model remains the same.

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
