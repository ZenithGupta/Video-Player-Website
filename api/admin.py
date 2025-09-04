from django.contrib import admin
from .models import (
    PainAssessmentSubmission, Video, Course, UserCourse, User,
    Phase, Week, Day
)

# Admin view for Day model
class DayAdmin(admin.ModelAdmin):
    filter_horizontal = ('videos',)
    list_display = ('title', 'day_number', 'is_rest_day')

# Admin view for Week model
class WeekAdmin(admin.ModelAdmin):
    filter_horizontal = ('days',)
    list_display = ('title', 'week_number')

# Admin view for Phase model
class PhaseAdmin(admin.ModelAdmin):
    filter_horizontal = ('weeks',)
    list_display = ('title', 'phase_number', 'course')


# Custom admin view for the UserCourse model
class UserCourseAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'start_time', 'end_time', 'current_phase')
    readonly_fields = ('start_time', 'end_time')

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj and obj.course:
            form.base_fields['current_phase'].queryset = Phase.objects.filter(course=obj.course)
        else:
            form.base_fields['current_phase'].queryset = Phase.objects.none()
            form.base_fields['current_phase'].help_text = "Select a course and save before choosing a phase."
        return form


# Register your models here
admin.site.register(PainAssessmentSubmission)
admin.site.register(Video)
admin.site.register(Day, DayAdmin)
admin.site.register(Week, WeekAdmin)
admin.site.register(Phase, PhaseAdmin)
admin.site.register(Course)
admin.site.register(UserCourse, UserCourseAdmin)
admin.site.register(User)