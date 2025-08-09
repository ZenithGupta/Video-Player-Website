from django.contrib import admin
from .models import PainAssessmentSubmission

# This line makes your model visible in the admin panel
admin.site.register(PainAssessmentSubmission)