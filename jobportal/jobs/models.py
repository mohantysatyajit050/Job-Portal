from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Job(models.Model):
    employer = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    salary = models.IntegerField()
    description = models.TextField()

    # ✅ ADD THIS FIELD
    skills_required = models.TextField(default="Python")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# 🔹 Application Model
class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    applicant = models.ForeignKey(User, on_delete=models.CASCADE)

    # ✅ UPDATED HERE
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)


    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant} applied to {self.job}"