from django.contrib import admin
from adminsortable2.admin import SortableInlineAdminMixin, SortableAdminBase
from .models import (
    PainAssessmentSubmission, Video, Course, UserCourse, User,
    Phase, Week, Playlist, SuperCourse, PlaylistVideo
)

# Inline for the through model with drag-and-drop
class PlaylistVideoInline(SortableInlineAdminMixin, admin.TabularInline):
    model = PlaylistVideo
    extra = 1
    fields = ('video',)  # Hide the 'order' field
    readonly_fields = []


class PlaylistAdmin(SortableAdminBase, admin.ModelAdmin):
    inlines = [PlaylistVideoInline]
    list_display = ('title', 'video_count')
    
    def video_count(self, obj):
        return obj.videos.count()
    video_count.short_description = 'Number of Videos'

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
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_free_trial', 'average_pain_score', 'price')
    list_filter = ('is_free_trial',)
    search_fields = ('title',)
    
    class Media:
        js = ('js/course_admin.js',)

admin.site.register(Course, CourseAdmin)
admin.site.register(SuperCourse)
admin.site.register(UserCourse, UserCourseAdmin)
admin.site.register(User)

# Enable Token Management in Admin
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

class OutstandingTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'jti', 'created_at', 'expires_at')
    search_fields = ('user__email', 'jti')
    list_filter = ('user',)

class BlacklistedTokenAdmin(admin.ModelAdmin):
    list_display = ('token', 'blacklisted_at')

# Enable Token Management in Admin
# Note: OutstandingToken and BlacklistedToken are automatically registered by 
# rest_framework_simplejwt.token_blacklist.admin.
# We do NOT need to register them manually, which causes AlreadyRegistered error.
# If we wanted to customize them, we would need to unregister them first.
# Since the default is fine, we just leave this empty or unregister if we really wanted custom.
# For now, just removing the manual register calls fixes the crash.