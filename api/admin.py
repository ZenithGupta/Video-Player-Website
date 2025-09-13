from django.contrib import admin
from .models import (
    PainAssessmentSubmission, Video, Course, UserCourse, User,
    Phase, Week, Playlist, SuperCourse
)

class PlaylistAdmin(admin.ModelAdmin):
    filter_horizontal = ('videos',)

class WeekAdmin(admin.ModelAdmin):
    list_display = ('title', 'week_number', 'playlist')

class PhaseAdmin(admin.ModelAdmin):
    filter_horizontal = ('weeks',)
    list_display = ('title', 'phase_number', 'course')

class UserCourseAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'start_time', 'end_time', 'current_phase')
    readonly_fields = ('start_time', 'end_time')

    # This is the restored method
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj and obj.course:
            form.base_fields['current_phase'].queryset = Phase.objects.filter(course=obj.course)
        else:
            # When adding a new entry, the phase list is empty until a course is saved.
            form.base_fields['current_phase'].queryset = Phase.objects.none()
            form.base_fields['current_phase'].help_text = "Select a course and save before choosing a phase."
        return form

# Register your models here
admin.site.register(PainAssessmentSubmission)
admin.site.register(Video)
admin.site.register(Playlist, PlaylistAdmin)
admin.site.register(Week, WeekAdmin)
admin.site.register(Phase, PhaseAdmin)
admin.site.register(Course)
admin.site.register(SuperCourse)
admin.site.register(UserCourse, UserCourseAdmin)
admin.site.register(User)