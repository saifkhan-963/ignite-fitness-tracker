from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils.timezone import now
from datetime import timedelta


# Extend Django's User model for custom fields if needed
class User(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    avatar = models.CharField(max_length=200, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    country = models.CharField(max_length=50, blank=True, null=True)
    total_steps = models.PositiveIntegerField(default=0)
    total_distance = models.FloatField(default=0.0)
    total_time = models.DurationField(default=timedelta())
    total_runs = models.PositiveIntegerField(default=0)
    weight = models.FloatField(blank=True, null=True)
    height = models.FloatField(blank=True, null=True)
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.username

    def calculate_bmi(self):
        if self.weight and self.height:
            height_in_meters = self.height / 100
            return self.weight / (height_in_meters ** 2)
        return None


class Run(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="runs")
    date = models.DateField(default=now)
    steps = models.PositiveIntegerField()
    distance = models.FloatField()
    duration = models.DurationField()
    average_pace = models.FloatField(blank=True, null=True)
    calories_burned = models.FloatField(blank=True, null=True)

    def calculate_pace(self):
        if self.distance > 0:
            return self.duration.total_seconds() / 60 / self.distance
        return None

    def calculate_calories(self):
        if self.user.weight and self.distance > 0:
            self.calories_burned = self.user.weight * self.distance * 1.036
        return self.calories_burned

    def __str__(self):
        return f"{self.user.username} - {self.date}"


class Path(models.Model):
    run = models.ForeignKey(Run, on_delete=models.CASCADE, related_name="path")
    coordinates = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.run.user.username} - {self.run.date} - {self.timestamp}"


class Achievement(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.ImageField(upload_to='achievements/')
    criteria = models.CharField(max_length=200)
    regular = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="achievements")
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"


class Leaderboard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="leaderboard")
    ranking = models.PositiveIntegerField()
    time_period = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.username} - {self.time_period}"


class RunSession(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_sessions')
    participants = models.ManyToManyField(User, related_name='joined_sessions', blank=True)
    invite_code = models.CharField(max_length=8, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.host.username} - {self.invite_code}"


class Challenge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    participants = models.ManyToManyField(User, related_name="challenges")
    distance_goal = models.FloatField()

    def __str__(self):
        return self.name


class WaitlistEntry(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email