from django.db import models

class PainAssessmentSubmission(models.Model):
    """
    This model stores a single submission from the pain assessment form.
    """
    # We use IntegerFields to store the score (1, 2, or 3) for each question.
    # The `help_text` provides a description in the Django admin panel.

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

    # This field automatically records the date and time of the submission.
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Submission from {self.submitted_at.strftime('%Y-%m-%d %H:%M')}"