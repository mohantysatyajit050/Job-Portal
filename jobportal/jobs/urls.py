from django.urls import path
from .views import (
    JobListCreateView,
    JobDetailView,
    ApplyJobView,
    FilteredJobListView,
)

urlpatterns = [
    # 🔹 Get jobs based on profile (MATCHED JOBS)
    path('filter/', FilteredJobListView.as_view(), name='filtered-jobs'),

    # 🔹 Get all jobs + Post job
    path('', JobListCreateView.as_view(), name='job-list-create'),

    # 🔹 Apply to a specific job (VERY IMPORTANT FIX)
    path('apply/<int:job_id>/', ApplyJobView.as_view(), name='apply-job'),

    # 🔹 Get single job / update / delete
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
]