from django.core.management.base import BaseCommand
from api.models import User, Course, Week, Video, UserCourse, Phase, Playlist, SuperCourse, PlaylistVideo


class Command(BaseCommand):
    help = 'Populates the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Deleting old data...")
        UserCourse.objects.all().delete()
        Phase.objects.all().delete()
        Week.objects.all().delete()
        PlaylistVideo.objects.all().delete()  # Delete through model instances
        Playlist.objects.all().delete()
        Video.objects.all().delete()
        Course.objects.all().delete()
        SuperCourse.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        self.stdout.write("Creating new data...")

        # 1. Create Videos
        video1 = Video.objects.create(
            title="Intro to Pain Relief",
            vimeo_url="https://vimeo.com/1111049635/235a23f8a0",
            image="https://i.vimeocdn.com/video/2048942115-33354f071e7cfd0317e3c2947b4448891dcda6ae01dcb41d67e8ae1d2ca8a86d-d?mw=900&q=70"
        )
        video2 = Video.objects.create(
            title="Core Strengthening",
            vimeo_url="https://vimeo.com/1111050393/ec9e054769",
            image="https://i.vimeocdn.com/video/2048942766-c2534fc3567ba084e69ffdf3173223d547540089c29be491e965ad64959a7c4e-d?mw=900&q=70"
        )
        video3 = Video.objects.create(
            title="Mobility Drills",
            vimeo_url="https://vimeo.com/1111049635/235a23f8a0",
            image="https://i.vimeocdn.com/video/2048942115-33354f071e7cfd0317e3c2947b4448891dcda6ae01dcb41d67e8ae1d2ca8a86d-d?mw=900&q=70"
        )
        
        # 2. Create Playlists
        playlist1 = Playlist.objects.create(title="Week 1 Playlist")
        playlist2 = Playlist.objects.create(title="Week 2 Playlist")
        playlist3 = Playlist.objects.create(title="Week 3 Playlist")
        playlist4 = Playlist.objects.create(title="Week 4 Playlist")
        
        # 3. Add videos to playlists with explicit ordering
        videos_for_playlist1 = [video1, video2, video1, video3, video2, video1, video3]
        for order, video in enumerate(videos_for_playlist1):
            PlaylistVideo.objects.create(playlist=playlist1, video=video, order=order)
        
        videos_for_playlist2 = [video2, video1, video3, video1, video2, video3, video1]
        for order, video in enumerate(videos_for_playlist2):
            PlaylistVideo.objects.create(playlist=playlist2, video=video, order=order)
        
        videos_for_playlist3 = [video3, video2, video1, video2, video3, video1, video2]
        for order, video in enumerate(videos_for_playlist3):
            PlaylistVideo.objects.create(playlist=playlist3, video=video, order=order)
        
        videos_for_playlist4 = [video1, video3, video2, video3, video1, video2, video1]
        for order, video in enumerate(videos_for_playlist4):
            PlaylistVideo.objects.create(playlist=playlist4, video=video, order=order)

        # 4. Create Weeks
        week1 = Week.objects.create(title="Week 1", week_number=1, playlist=playlist1)
        week2 = Week.objects.create(title="Week 2", week_number=2, playlist=playlist2)
        week3 = Week.objects.create(title="Week 3", week_number=3, playlist=playlist3)
        week4 = Week.objects.create(title="Week 4", week_number=4, playlist=playlist4)

        # 5. Create SuperCourses and Courses
        super_course1 = SuperCourse.objects.create(
            title="Knee Pain Recovery Program",
            bestseller=True,
            rating=4.8
        )
        course1_4_weeks = Course.objects.create(
            super_course=super_course1,
            title="Knee Pain Recovery Program (4 Weeks)",
            validity_weeks=4,
            price="499"
        )
        course1_8_weeks = Course.objects.create(
            super_course=super_course1,
            title="Knee Pain Recovery Program (8 Weeks)",
            validity_weeks=8,
            price="899"
        )
        
        super_course2 = SuperCourse.objects.create(
            title="Back Pain Relief Program",
            rating=4.6
        )
        course2_4_weeks = Course.objects.create(
            super_course=super_course2,
            title="Back Pain Relief Program (4 Weeks)",
            validity_weeks=4,
            price="599"
        )
        course2_8_weeks = Course.objects.create(
            super_course=super_course2,
            title="Back Pain Relief Program (8 Weeks)",
            validity_weeks=8,
            price="999"
        )
        
        # 6. Create Phases for each course
        phase1_course1 = Phase.objects.create(
            title="Phase 1: Foundation and Recovery",
            course=course1_4_weeks,
            phase_number=1
        )
        phase1_course1.weeks.set([week1, week2, week3, week4])
        
        phase1_course2 = Phase.objects.create(
            title="Phase 1: Foundation and Recovery",
            course=course1_8_weeks,
            phase_number=1
        )
        phase1_course2.weeks.set([week1, week2, week3, week4])
        
        phase1_course3 = Phase.objects.create(
            title="Phase 1: Foundation and Recovery",
            course=course2_4_weeks,
            phase_number=1
        )
        phase1_course3.weeks.set([week1, week2, week3, week4])
        
        phase1_course4 = Phase.objects.create(
            title="Phase 1: Foundation and Recovery",
            course=course2_8_weeks,
            phase_number=1
        )
        phase1_course4.weeks.set([week1, week2, week3, week4])

        # 7. Create Sample Users
        self.stdout.write("Creating sample users...")
        user1 = User.objects.create_user(
            email='alice@example.com',
            password='password123',
            first_name='Alice'
        )
        user2 = User.objects.create_user(
            email='bob@example.com',
            password='password123',
            first_name='Bob'
        )
        
        # 8. Enroll Alice in the course
        UserCourse.objects.create(
            user=user1,
            course=course1_4_weeks,
            current_phase=phase1_course1
        )

        self.stdout.write(self.style.SUCCESS('Database has been populated successfully!'))