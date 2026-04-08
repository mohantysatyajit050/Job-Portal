from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer


# 🔹 Skill-based job filtering
class FilteredJobListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, "profile", None)

        if not profile or not profile.skills:
            return Response([])

        user_skills = [s.lower() for s in profile.skills]

        jobs = Job.objects.all()
        matched_jobs = []

        for job in jobs:
            job_skills = [
                s.strip().lower()
                for s in job.skills_required.split(",")
                if s.strip()
            ]

            if any(skill in job_skills for skill in user_skills):
                matched_jobs.append(job)

        serializer = JobSerializer(matched_jobs, many=True)
        return Response(serializer.data)

# 🔹 Employer - My Jobs
class MyJobsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = Job.objects.filter(employer=request.user)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)


# 🔹 Public Job List
class JobListView(generics.ListAPIView):
    queryset = Job.objects.all().order_by("-created_at")
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]


# 🔹 Create Job (Employer Only)
class JobCreateView(generics.CreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # ✅ Safely get profile
        profile = getattr(self.request.user, "profile", None)

        # ❌ If profile missing OR not employer
        if not profile or profile.role != "employer":
            raise PermissionDenied("Only employers can post jobs")

        # 🔐 Admin approval check (IMPORTANT)
        if not profile.is_approved:
            raise PermissionDenied("Your account is not approved yet")

        # ✅ Save job
        serializer.save(
            employer=self.request.user,
            company=getattr(profile, "company", self.request.user.username)
        )


# 🔹 Job Detail
class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        if self.request.user != serializer.instance.employer:
            raise PermissionDenied("You can only update your own job")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.employer:
            raise PermissionDenied("You can only delete your own job")
        instance.delete()


# 🔹 Apply Job (Job Seeker Only)
class ApplyJobView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, job_id):
        profile = getattr(request.user, "profile", None)

        # 🔐 Role check
        if not profile or profile.role != "jobseeker":
            raise PermissionDenied("Only job seekers can apply")

        # 🔐 Admin approval check
        if not profile.is_approved:
            return Response({"detail": "Account not approved yet"}, status=403)

        job = get_object_or_404(Job, id=job_id)

        # ❌ Prevent duplicate
        if Application.objects.filter(applicant=request.user, job=job).exists():
            return Response(
                {"detail": "You already applied to this job"},
                status=400
            )

        resume = request.FILES.get("resume")

        # ❌ Resume required
        if not resume:
            return Response(
                {"detail": "Resume is required"},
                status=400
            )

        application = Application.objects.create(
            applicant=request.user,
            job=job,
            resume=resume,
            status="pending"
        )

        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=201)


# 🔹 Job Seeker Activity Page API
class MyApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        applications = Application.objects.filter(applicant=request.user)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)


# 🔹 Employer - View Applicants for a Job
class JobApplicantsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        job = get_object_or_404(Job, id=job_id)

        if job.employer != request.user:
            raise PermissionDenied("Not allowed")

        applications = Application.objects.filter(job=job)
        serializer = ApplicationSerializer(applications, many=True)

        return Response(serializer.data)


# 🔥 Update Application Status (Accept / Reject / Pending)
class UpdateApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        application = get_object_or_404(Application, id=pk)

        # Only job owner can update
        if application.job.employer != request.user:
            raise PermissionDenied("Not allowed")

        status = request.data.get("status")

        # ✅ Allow all 3 statuses
        if status not in ["pending", "accepted", "rejected"]:
            return Response({"error": "Invalid status"}, status=400)

        application.status = status
        application.save()

        return Response({
    "message": "Status updated",
    "status": application.status
})
