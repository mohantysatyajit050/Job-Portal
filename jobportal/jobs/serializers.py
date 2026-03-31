from rest_framework import serializers
from .models import Job, Application


# 🔹 Job Serializer
class JobSerializer(serializers.ModelSerializer):
    employer_username = serializers.CharField(source='employer.username', read_only=True)

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['employer', 'created_at']


# 🔹 Application Serializer
class ApplicationSerializer(serializers.ModelSerializer):
    applicant_username = serializers.CharField(source='applicant.username', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['applicant', 'applied_at']