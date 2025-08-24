import random
from django.core.management.base import BaseCommand
from api.models import User, Course, Playlist, Video, UserCourse

class Command(BaseCommand):
    help = 'Populates the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Deleting old data...")
        # Order of deletion matters to avoid foreign key constraint errors
        UserCourse.objects.all().delete()
        Playlist.objects.all().delete()
        Video.objects.all().delete()
        Course.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete() # Keep superusers

        self.stdout.write("Creating new data...")

        # --- 1. Create Sample Videos ---
        video1 = Video.objects.create(
            title="Introduction to Pain Relief",
            instructor="Dr. Anya Sharma",
            description="A beginner's guide to understanding and managing joint pain.",
            vimeo_url="https://vimeo.com/1111049635/235a23f8a0",
            image="https://placehold.co/240x135/FFC107/FFFFFF?text=Video1",
            category="Pain Relief",
            rating=4.8
        )
        video2 = Video.objects.create(
            title="Advanced Core Strengthening",
            instructor="Mr. Rohan Verma",
            description="Build a rock-solid core to support your spine and improve posture.",
            vimeo_url="https://vimeo.com/1111050393/ec9e054769",
            image="https://placehold.co/240x135/4CAF50/FFFFFF?text=Video2",
            category="Strength Training",
            rating=4.9
        )
        # Add more videos as needed...

        # --- 2. Create Sample Courses ---
        course1 = Course.objects.create(
            title="Knee Pain Recovery Program",
            validity_days=45,
            bestseller=True,
            price="1499"
        )
        course2 = Course.objects.create(
            title="Full Body Strength & Mobility",
            validity_days=60,
            bestseller=False,
            price="2999"
        )

        # --- 3. Create Sample Playlists with specific IDs ---
        playlist1 = Playlist.objects.create(
            playlist_id=101,  # Assign a specific ID
            title="Week 1: Foundations",
            course=course1
        )
        playlist1.videos.add(video1)

        playlist2 = Playlist.objects.create(
            playlist_id=102, # Assign a specific ID
            title="Week 2: Building Strength",
            course=course1
        )
        playlist2.videos.add(video2)
        
        playlist3 = Playlist.objects.create(
            playlist_id=201, # Assign a specific ID
            title="Phase 1: Mobility",
            course=course2
        )
        playlist3.videos.add(video1, video2)


        # --- 4. Create Sample Users ---
        self.stdout.write("Creating sample users...")
        user1 = User.objects.create_user(
            email='alice@example.com',
            password='password123',
            first_name='Alice',
            last_name='Smith'
        )
        user2 = User.objects.create_user(
            email='bob@example.com',
            password='password123',
            first_name='Bob',
            last_name='Johnson'
        )

        # --- 5. Link Users to Courses and Playlists ---
        self.stdout.write("Creating UserCourse entries...")
        all_courses = list(Course.objects.all())
        all_playlists = list(Playlist.objects.all())
        all_users = [user1, user2]

        for user in all_users:
            # Assign a random course and playlist to each user
            random_course = random.choice(all_courses)
            # Ensure the chosen playlist belongs to the chosen course
            random_playlist = random.choice(list(random_course.playlists.all()))

            UserCourse.objects.create(
                user=user,
                course=random_course,
                playlist=random_playlist # Use 'playlist' as per your updated model
            )

        self.stdout.write(self.style.SUCCESS('Database has been populated successfully!'))