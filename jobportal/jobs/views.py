from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class FilteredJobListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.profile

        # Convert skills to lowercase list
        user_skills = [s.strip().lower() for s in profile.skills.split(",") if s]

        jobs = Job.objects.all()
        matched_jobs = []

        for job in jobs:
            job_skills = [s.strip().lower() for s in job.skills_required.split(",") if s]

            # Skill matching
            if any(skill in job_skills for skill in user_skills):
                matched_jobs.append(job)

        serializer = JobSerializer(matched_jobs, many=True)
        return Response(serializer.data)

# 🔹 Job APIs
class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # ✅ Only employers can post jobs
        if self.request.user.profile.role != "employer":
            raise PermissionDenied("Only employers can post jobs")

        serializer.save(employer=self.request.user)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]


# 🔹 Apply Job API
class ApplyJobView(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # ✅ Only job seekers can apply
        if self.request.user.profile.role != "jobseeker":
            raise PermissionDenied("Only job seekers can apply")

        job = serializer.validated_data.get("job")

        # ❌ Prevent duplicate applications
        if Application.objects.filter(
            applicant=self.request.user,
            job=job
        ).exists():
            raise PermissionDenied("You already applied to this job")

        # ✅ Save application
        serializer.save(applicant=self.request.user)