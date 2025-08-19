from django.contrib import admin
from .models import PainAssessmentSubmission, Video, Playlist, Course, UserCourse, User

# Custom admin view for the Playlist model
class PlaylistAdmin(admin.ModelAdmin):
    filter_horizontal = ('videos',)

# Custom admin view for the UserCourse model
class UserCourseAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'start_time', 'end_time') # 'validity_days' has been removed
    readonly_fields = ('start_time', 'end_time')

# Register your models here
admin.site.register(PainAssessmentSubmission)
admin.site.register(Video)
admin.site.register(Playlist, PlaylistAdmin)
admin.site.register(Course)
admin.site.register(UserCourse, UserCourseAdmin)
admin.site.register(User)