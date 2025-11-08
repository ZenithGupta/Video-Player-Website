from django.core.management.base import BaseCommand
from api.models import User, Course, Week, Video, UserCourse, Phase, Playlist, SuperCourse

class Command(BaseCommand):
    help = 'Populates the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Deleting old data...")
        UserCourse.objects.all().delete()
        Phase.objects.all().delete()
        Week.objects.all().delete()
        Playlist.objects.all().delete()
        Video.objects.all().delete()
        Course.objects.all().delete()
        SuperCourse.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        self.stdout.write("Creating new data...")

        # 1. Create Videos
        # Create videos (no instructor/category/rating fields on Video anymore)
        video1 = Video.objects.create(title="Intro to Pain Relief", vimeo_url="https://vimeo.com/1111049635/235a23f8a0", image="https://i.vimeocdn.com/video/2048942115-33354f071e7cfd0317e3c2947b4448891dcda6ae01dcb41d67e8ae1d2ca8a86d-d?mw=900&q=70")
        video2 = Video.objects.create(title="Core Strengthening", vimeo_url="https://vimeo.com/1111050393/ec9e054769", image="https://i.vimeocdn.com/video/2048942766-c2534fc3567ba084e69ffdf3173223d547540089c29be491e965ad64959a7c4e-d?mw=900&q=70")
        video3 = Video.objects.create(title="Mobility Drills", vimeo_url="https://vimeo.com/1111049635/235a23f8a0", image="https://i.vimeocdn.com/video/2048942115-33354f071e7cfd0317e3c2947b4448891dcda6ae01dcb41d67e8ae1d2ca8a86d-d?mw=900&q=70")
        
        # 2. Create Playlists for Weeks
        playlist1 = Playlist.objects.create(title="Week 1 Playlist")
        playlist1.videos.set([video1, video2, video1, video3, video2, video1, video3])
        playlist2 = Playlist.objects.create(title="Week 2 Playlist")
        playlist2.videos.set([video2, video1, video3, video1, video2, video3, video1])
        playlist3 = Playlist.objects.create(title="Week 3 Playlist")
        playlist3.videos.set([video3, video2, video1, video2, video3, video1, video2])
        playlist4 = Playlist.objects.create(title="Week 4 Playlist")
        playlist4.videos.set([video1, video3, video2, video3, video1, video2, video1])

        # 3. Create Weeks
        week1 = Week.objects.create(title="Week 1", week_number=1, playlist=playlist1)
        week2 = Week.objects.create(title="Week 2", week_number=2, playlist=playlist2)
        week3 = Week.objects.create(title="Week 3", week_number=3, playlist=playlist3)
        week4 = Week.objects.create(title="Week 4", week_number=4, playlist=playlist4)

        # 4. Create SuperCourses and Courses
        # Set a course-level rating on SuperCourse (videos no longer carry rating)
        super_course1 = SuperCourse.objects.create(title="Knee Pain Recovery Program", bestseller=True, rating=4.8)
        course1_4_weeks = Course.objects.create(super_course=super_course1, title="Knee Pain Recovery Program (4 Weeks)", validity_weeks=4, price="499")
        course1_8_weeks = Course.objects.create(super_course=super_course1, title="Knee Pain Recovery Program (8 Weeks)", validity_weeks=8, price="899")
        
        super_course2 = SuperCourse.objects.create(title="Back Pain Relief Program", rating=4.6)
        course2_4_weeks = Course.objects.create(super_course=super_course2, title="Back Pain Relief Program (4 Weeks)", validity_weeks=4, price="599")
        course2_8_weeks = Course.objects.create(super_course=super_course2, title="Back Pain Relief Program (8 Weeks)", validity_weeks=8, price="999")
        
        # 5. Create Phases for each course
        phase1_course1 = Phase.objects.create(title="Phase 1: Foundation and Recovery", course=course1_4_weeks, phase_number=1)
        phase1_course1.weeks.set([week1, week2, week3, week4])
        
        phase1_course2 = Phase.objects.create(title="Phase 1: Foundation and Recovery", course=course1_8_weeks, phase_number=1)
        phase1_course2.weeks.set([week1, week2, week3, week4])
        
        phase1_course3 = Phase.objects.create(title="Phase 1: Foundation and Recovery", course=course2_4_weeks, phase_number=1)
        phase1_course3.weeks.set([week1, week2, week3, week4])
        
        phase1_course4 = Phase.objects.create(title="Phase 1: Foundation and Recovery", course=course2_8_weeks, phase_number=1)
        phase1_course4.weeks.set([week1, week2, week3, week4])


        # 6. Create Sample Users
        self.stdout.write("Creating sample users...")
        # User 1: Alice is ENROLLED in the course.
        user1 = User.objects.create_user(email='alice@example.com', password='password123', first_name='Alice')
        # User 2: Bob is NOT enrolled in any course.
        user2 = User.objects.create_user(email='bob@example.com', password='password123', first_name='Bob')
        
        # 7. Enroll ONLY Alice in the course to create the two test scenarios.
        # This is why only one UserCourse object is created.
        UserCourse.objects.create(user=user1, course=course1_4_weeks, current_phase=phase1_course1)

        self.stdout.write(self.style.SUCCESS('Database has been populated successfully!'))