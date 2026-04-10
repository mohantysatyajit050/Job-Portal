from django.urls import path
from .views import (
    JobListView,
    JobCreateView,
    JobDetailView,
    ApplyJobView,
    MyJobsView,
    FilteredJobListView,
    MyApplicationsView,
    JobApplicantsView,
    UpdateApplicationStatusView,
)

urlpatterns = [
    path('', JobListView.as_view(), name='job-list'),

    path('create/', JobCreateView.as_view(), name='job-create'),

    path('my-jobs/', MyJobsView.as_view(), name='my-jobs'),

    path('apply/<int:job_id>/', ApplyJobView.as_view(), name='apply-job'),

    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),

    path('filter/', FilteredJobListView.as_view(), name='filtered-jobs'),

    path('my-applications/', MyApplicationsView.as_view(), name='my-applications'),

    path('<int:job_id>/applicants/', JobApplicantsView.as_view(), name='job-applicants'),

    path('applications/<int:pk>/status/', UpdateApplicationStatusView.as_view(), name='update-status'),
]