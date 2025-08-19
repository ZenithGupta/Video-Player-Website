import random
from django.core.management.base import BaseCommand
from api.models import Video, Playlist, Course

class Command(BaseCommand):
    help = 'Populates the database with sample videos, playlists, and courses.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database population...'))

        # --- Create Videos ---
        videos_data = [
            {'title': 'Complete Guide to Knee Pain Relief', 'vimeo_url': 'https://vimeo.com/1111049635/235a23f8a0'},
            {'title': 'Yoga for a Healthy Back', 'vimeo_url': 'https://vimeo.com/1111050393/ec9e054769'},
            {'title': 'Core Strength Masterclass', 'vimeo_url': 'https://vimeo.com/1111050062/cbaa063839'},
            {'title': 'Full Body Home Workout', 'vimeo_url': 'https://vimeo.com/1108493445/5e071e7c0e'},
            {'title': 'Ultimate Flexibility Guide', 'vimeo_url': 'https://vimeo.com/1110539886/3f14f6333c'},
        ]

        videos = []
        for video_data in videos_data:
            video, created = Video.objects.get_or_create(
                vimeo_url=video_data['vimeo_url'],
                defaults={
                    'title': video_data['title'],
                    'instructor': 'Dr. Physio',
                    'description': 'A sample description.',
                    'image': 'https://placehold.co/240x135/749BC2/FFFFFF?text=Video',
                    'category': random.choice([choice[0] for choice in Video.CATEGORY_CHOICES]),
                    'rating': round(random.uniform(4.0, 5.0), 1),
                }
            )
            videos.append(video)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Successfully created video: {video.title}'))

        # --- Create Courses and Playlists ---
        for i in range(3): # Create 3 courses
            course, created = Course.objects.get_or_create(
                title=f'Sample Course {i + 1}',
                defaults={
                    'validity_days': random.randint(30, 90),
                    'bestseller': random.choice([True, False]),
                    'price': str(random.randint(1000, 5000)),
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Successfully created course: {course.title}'))

            for j in range(2): # Create 2 playlists per course
                playlist, created = Playlist.objects.get_or_create(
                    title=f'Playlist {j + 1} for Course {course.title}',
                    course=course
                )
                if created:
                    # Add 2-3 random videos to the playlist
                    playlist.videos.set(random.sample(videos, k=random.randint(2, 3)))
                    self.stdout.write(self.style.SUCCESS(f'Successfully created playlist: {playlist.title}'))

        self.stdout.write(self.style.SUCCESS('Database population complete.'))