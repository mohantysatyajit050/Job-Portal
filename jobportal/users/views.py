from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from .models import Profile


# 🔹 REGISTER
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role')

    if role not in ['jobseeker', 'employer']:
        return Response({"error": "Invalid role selected"}, status=status.HTTP_400_BAD_REQUEST)

    if not username or not password or not email:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        profile, _ = Profile.objects.get_or_create(user=user)
        profile.role = role
        profile.save()

        return Response({
            "message": "User registered successfully",
            "username": user.username,
            "role": profile.role
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 🔹 LOGIN
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    token, _ = Token.objects.get_or_create(user=user)
    profile, _ = Profile.objects.get_or_create(user=user)

    if not profile.role:
        profile.role = "jobseeker"
        profile.save()

    return Response({
        "message": "Login successful",
        "token": token.key,
        "role": profile.role,
        "username": user.username
    }, status=status.HTTP_200_OK)


# 🔹 GET PROFILE
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)

    return Response({
        "username": request.user.username,
        "email": request.user.email,
        "role": profile.role,
        "resume": profile.resume.url if profile.resume else None,
        "skills": profile.skills,
        "courses": profile.courses,
        "experience": profile.experience,   # 🔥 NEW
        "is_complete": profile.is_complete
    })


# 🔹 UPDATE PROFILE
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)

    if request.FILES.get('resume'):
        profile.resume = request.FILES['resume']

    skills = request.data.get('skills')
    courses = request.data.get('courses')
    experience = request.data.get('experience')   # 🔥 NEW

    if skills:
        # Strip whitespace from each skill
        profile.skills = [s.strip() for s in skills.split(",") if s.strip()]

    if courses:
        profile.courses = [c.strip() for c in courses.split(",") if c.strip()]

    if experience:
        profile.experience = experience   # 🔥 NEW

    profile.save()

    return Response({
        "message": "Profile updated successfully",
        "is_complete": profile.is_complete
    })


# 🔹 SELECT ROLE
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def select_role(request):
    role = request.data.get('role')

    if role not in ['jobseeker', 'employer']:
        return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

    profile, _ = Profile.objects.get_or_create(user=request.user)
    profile.role = role
    profile.save()

    return Response({"message": "Role updated successfully"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Delete the token to logout
        request.user.auth_token.delete()
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    except:
        return Response({"error": "Error during logout"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from jobs.models import Application

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def application_stats(request):
    user = request.user

    total_applications = Application.objects.filter(applicant=user).count()

    accepted = Application.objects.filter(applicant=user, status='accepted').count()
    rejected = Application.objects.filter(applicant=user, status='rejected').count()
    pending = Application.objects.filter(applicant=user, status='pending').count()

    return Response({
        "total_applications": total_applications,
        "accepted": accepted,
        "rejected": rejected,
        "pending": pending,
        "interviews": accepted,
        "job_matches": 0
    })