import random
from django.core.management.base import BaseCommand
from api.models import User, Course, Week, Video, UserCourse, Phase, Day

class Command(BaseCommand):
    help = 'Populates the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Deleting old data...")
        UserCourse.objects.all().delete()
        Phase.objects.all().delete()
        Week.objects.all().delete()
        Day.objects.all().delete()
        Video.objects.all().delete()
        Course.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

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

        # --- 2. Create a single set of Day objects ---
        self.stdout.write("Creating a reusable 7-day schedule...")
        day1 = Day.objects.create(title="Day 1", day_number=1)
        day1.videos.add(video1)
        
        day2 = Day.objects.create(title="Day 2", day_number=2)
        day2.videos.add(video2)

        day3 = Day.objects.create(title="Day 3", day_number=3)
        day3.videos.add(video1)

        day4 = Day.objects.create(title="Day 4 (Rest)", day_number=4, is_rest_day=True)
        
        day5 = Day.objects.create(title="Day 5", day_number=5)
        day5.videos.add(video2)

        day6 = Day.objects.create(title="Day 6", day_number=6)
        day6.videos.add(video1)
        
        day7 = Day.objects.create(title="Day 7 (Rest)", day_number=7, is_rest_day=True)

        daily_schedule = [day1, day2, day3, day4, day5, day6, day7]

        # --- 3. Create Weeks and reuse the Day objects ---
        self.stdout.write("Creating weeks...")
        created_weeks = []
        for i in range(1, 5): # Create 4 weeks
            week = Week.objects.create(title=f"Week {i}", week_number=i)
            week.days.set(daily_schedule)
            created_weeks.append(week)

        # --- 4. Create Courses and Phases ---
        course1 = Course.objects.create(
            title="Knee Pain Recovery Program",
            validity_days=45,
            bestseller=True,
            price="1499"
        )
        
        phase1 = Phase.objects.create(title="Phase 1: Foundation and Recovery", course=course1, phase_number=1)
        phase1.weeks.set(created_weeks)

        # --- 5. Create Sample Users ---
        self.stdout.write("Creating sample users...")
        user1 = User.objects.create_user(
            email='alice@example.com',
            password='password123',
            first_name='Alice',
            last_name='Smith'
        )

        # --- 6. Link User to Course ---
        self.stdout.write("Creating UserCourse entries...")
        UserCourse.objects.create(
            user=user1,
            course=course1,
            current_phase=phase1
        )

        self.stdout.write(self.style.SUCCESS('Database has been populated successfully!'))