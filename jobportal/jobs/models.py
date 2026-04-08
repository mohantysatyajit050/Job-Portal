from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Job(models.Model):
    employer = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=200)
    salary = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField()

    # Skills required for matching
    skills_required = models.TextField(default="Python")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# 🔹 Application Model
class Application(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    applicant = models.ForeignKey(User, on_delete=models.CASCADE)

    # Resume upload
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)

    # ✅ Status field (default = pending)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant} applied to {self.job}"