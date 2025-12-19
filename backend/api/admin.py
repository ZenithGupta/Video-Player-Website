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

admin.site.register(OutstandingToken, OutstandingTokenAdmin)
# We might need to unregister first if it's already registered by default, but typically it is NOT registered by default in simplejwt unless we add it ourselves or use their admin class.
# However, simplejwt DOES register them if 'rest_framework_simplejwt.token_blacklist' is in INSTALLED_APPS.
# So we should try to unregister then re-register with our custom class, OR just let the default be if we don't care about custom columns.
# But the user explicitly asked for access, and the default admin is usually fine.
# Let's just Removing the 'unregister' block is enough to Bring Back BlacklistedToken.
# AND we should manually register OutstandingToken if it's not showing up.
# Actually, simplejwt's token_blacklist admin.py DOES register OutstandingToken.
# So simply REMOVING lines 65-70 should be enough to restore default behavior.
# BUT, to be safe and ensure they are visible, I will try to unregister (ignoring errors) and then register them.

try:
    admin.site.unregister(OutstandingToken)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(BlacklistedToken)
except admin.sites.NotRegistered:
    pass

admin.site.register(OutstandingToken, OutstandingTokenAdmin)
admin.site.register(BlacklistedToken, BlacklistedTokenAdmin)