from .permissions import IsAdminUserRole
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer



class AdminJobListView(generics.ListAPIView):
    queryset = Job.objects.all().order_by("-created_at")
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole]



class AdminJobApplicantsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request, job_id):
        job = get_object_or_404(Job, id=job_id)

        applications = Application.objects.filter(job=job)
        serializer = ApplicationSerializer(applications, many=True)

        return Response(serializer.data)
    
class AdminShortlistCandidateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def patch(self, request, pk):
        application = get_object_or_404(Application, id=pk)

        application.status = "shortlisted"
        application.is_admin_selected = True
        application.save()

        return Response({"message": "Candidate shortlisted by admin"})
    
class AdminShortlistedCandidatesView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request, job_id):
        shortlisted = Application.objects.filter(
            job_id=job_id,
            is_admin_selected=True
        )

        serializer = ApplicationSerializer(shortlisted, many=True)
        return Response(serializer.data)
    

# 🔹 Skill-based job filtering
class FilteredJobListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, "profile", None)

        if not profile or not profile.skills:
            return Response([])

        if isinstance(profile.skills, list):
            user_skills = [s.strip().lower() for s in profile.skills if s]
        else:
            user_skills = [s.strip().lower() for s in profile.skills.split(",") if s]

        jobs = Job.objects.all()
        matched_jobs = []

        for job in jobs:
            if isinstance(job.skills_required, list):
                job_skills = [s.strip().lower() for s in job.skills_required if s]
            else:
                job_skills = [s.strip().lower() for s in job.skills_required.split(",") if s]

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
        if self.request.user.profile.role != "employer":
            raise PermissionDenied("Only employers can post jobs")

        profile = getattr(self.request.user, "profile", None)

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
class ApplyJobView(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.profile.role != "jobseeker":
            raise PermissionDenied("Only job seekers can apply")

        job_id = self.kwargs.get("job_id")
        job = get_object_or_404(Job, id=job_id)

        # Prevent duplicate applications
        if Application.objects.filter(applicant=self.request.user, job=job).exists():
            raise PermissionDenied("You already applied to this job")

        # ✅ Default status = pending
        serializer.save(
            applicant=self.request.user,
            job=job,
            status="pending"
        )


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

        applications = Application.objects.filter(
           job=job,
           is_admin_selected=True   # ✅ Only shortlisted shown
      )
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
        if status not in ["pending", "shortlisted", "accepted", "rejected"]:
            return Response({"error": "Invalid status"}, status=400)

        application.status = status
        application.save()

        return Response({"message": "Status updated"})
