from django.core.management.base import BaseCommand
from api.models import User, Course, Week, Video, UserCourse, Phase, Playlist

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
        User.objects.exclude(is_superuser=True).delete()

        self.stdout.write("Creating new data...")

        # 1. Create Videos
        video1 = Video.objects.create(title="Intro to Pain Relief", vimeo_url="https://vimeo.com/1111049635/235a23f8a0", image="https://i.vimeocdn.com/video/1683964976-6d75a73e6e3381a8b7d40a9a116848037ed97802d294cb73c7d1e86a9e144c8d-d?mw=900&q=70", category="Pain Relief", rating=4.8, instructor="Dr. Sharma")
        video2 = Video.objects.create(title="Core Strengthening", vimeo_url="https://vimeo.com/1111050393/ec9e054769", image="https://i.vimeocdn.com/video/1683965618-63a033321682cee1f564104118712e08e73454721a979929837775620958b161-d?mw=900&q=70", category="Strength", rating=4.9, instructor="Mr. Verma")
        video3 = Video.objects.create(title="Mobility Drills", vimeo_url="https://vimeo.com/1111049635/235a23f8a0", image="https://i.vimeocdn.com/video/1683964976-6d75a73e6e3381a8b7d40a9a116848037ed97802d294cb73c7d1e86a9e144c8d-d?mw=900&q=70", category="Mobility", rating=4.7, instructor="Dr. Sharma")
        
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

        # 4. Create a Course and a Phase
        course1 = Course.objects.create(title="Knee Pain Recovery Program", bestseller=True, price="499")
        phase1 = Phase.objects.create(title="Phase 1: Foundation and Recovery", course=course1, phase_number=1)
        phase1.weeks.set([week1, week2, week3, week4])

        # 5. Create Sample Users
        self.stdout.write("Creating sample users...")
        # User 1: Alice is ENROLLED in the course.
        user1 = User.objects.create_user(email='alice@example.com', password='password123', first_name='Alice')
        # User 2: Bob is NOT enrolled in any course.
        user2 = User.objects.create_user(email='bob@example.com', password='password123', first_name='Bob')
        
        # 6. Enroll ONLY Alice in the course to create the two test scenarios.
        # This is why only one UserCourse object is created.
        UserCourse.objects.create(user=user1, course=course1, current_phase=phase1)

        self.stdout.write(self.style.SUCCESS('Database has been populated successfully!'))
