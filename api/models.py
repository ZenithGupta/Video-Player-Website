from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils.translation import gettext_lazy as _

# --- Custom User Model ---
# We extend Django's built-in User model to add a date of birth
# and to use the email as the unique identifier for login.

class CustomUser(AbstractUser):
    # We don't need a separate username, the email will be the username.
    username = None
    email = models.EmailField(_('email address'), unique=True)
    date_of_birth = models.DateField(null=True, blank=True)

    # Add related_name to resolve clashes with the default User model
    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="customuser_set",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="customuser_set",
        related_query_name="user",
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

# --- Course/Video Model ---
# This model stores all the information for a single course/video.

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
    
    # We store the Vimeo video ID, not the full URL, for flexibility.
    vimeo_id = models.CharField(max_length=50)
    
    # URL for the course's thumbnail image.
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
