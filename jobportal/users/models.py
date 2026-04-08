from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    ROLE_CHOICES = (
        ('jobseeker', 'Job Seeker'),
        ('employer', 'Employer'),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='jobseeker'
    )

    # 🔥 EXISTING FIELDS
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    skills = models.JSONField(default=list, blank=True)
    courses = models.JSONField(default=list, blank=True)
    experience = models.CharField(max_length=20, blank=True, default="")

    # 🔥 NEW ADMIN CONTROL FIELDS
    is_complete = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)   # ✅ Admin approval
    is_eligible = models.BooleanField(default=False)   # ✅ For filtering candidates
    test_score = models.FloatField(null=True, blank=True)  # ✅ For future test system

    def save(self, *args, **kwargs):
        # Profile is complete when resume + at least 1 skill is present
        if self.resume and len(self.skills) > 0:
            self.is_complete = True
        else:
            self.is_complete = False

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.role}"