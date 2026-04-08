# users/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from .models import Profile


# 🔹 ADMIN CHECK
def is_admin(user):
    return user.is_superuser


# 🔹 REGISTER
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role', 'jobseeker') # Default to jobseeker

    if role not in ['jobseeker', 'employer']:
        return Response({"error": "Invalid role selected"}, status=status.HTTP_400_BAD_REQUEST)

    if not username or not password or not email:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({"error": "Something went wrong during registration"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

    # Determine role, prioritizing superuser status
    if user.is_superuser:
        role = "admin"
    else:
        # Ensure profile has a role, default to jobseeker if not set
        if not profile.role:
            profile.role = "jobseeker"
            profile.save()
        role = profile.role

    return Response({
        "message": "Login successful",
        "token": token.key,
        "role": role,
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
        "experience": profile.experience,
        "is_complete": profile.is_complete,
        "is_approved": profile.is_approved,
        "is_eligible": profile.is_eligible,
        "test_score": profile.test_score
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
    experience = request.data.get('experience')

    if skills:
        profile.skills = [s.strip() for s in skills.split(",") if s.strip()]

    if courses:
        profile.courses = [c.strip() for c in courses.split(",") if c.strip()]

    if experience:
        profile.experience = experience

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


# 🔹 LOGOUT
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.user.auth_token.delete()
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    except:
        return Response({"error": "Error during logout"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============================
# 🔥 ADMIN APIs START HERE
# ============================

# 🔹 GET ALL USERS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_users(request):
    if not is_admin(request.user):
        return Response({"error": "Access denied. Admins only."}, status=status.HTTP_403_FORBIDDEN)

    users = User.objects.all().order_by('-date_joined')
    data = []

    for user in users:
        profile, _ = Profile.objects.get_or_create(user=user)

        # Correctly identify the role for display
        if user.is_superuser:
            role = "admin"
        else:
            role = profile.role

        data.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": role,
            "is_approved": profile.is_approved,
            "is_complete": profile.is_complete,
            "is_eligible": profile.is_eligible,
            "test_score": profile.test_score
        })

    return Response(data)


# 🔹 APPROVE USER
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_approve_user(request, user_id):
    if not is_admin(request.user):
        return Response({"error": "Access denied. Admins only."}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(id=user_id)
        profile, _ = Profile.objects.get_or_create(user=user)

        profile.is_approved = True
        profile.save()

        return Response({"message": f"User '{user.username}' approved successfully."})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# 🔹 DELETE USER
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_user(request, user_id):
    if not is_admin(request.user):
        return Response({"error": "Access denied. Admins only."}, status=status.HTTP_403_FORBIDDEN)

    try:
        user_to_delete = User.objects.get(id=user_id)
        
        # Prevent admin from deleting themselves
        if user_to_delete == request.user:
            return Response({"error": "You cannot delete your own account."}, status=status.HTTP_400_BAD_REQUEST)
            
        username = user_to_delete.username
        user_to_delete.delete()
        return Response({"message": f"User '{username}' deleted successfully."})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# 🔹 MARK ELIGIBLE
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_mark_eligible(request, user_id):
    if not is_admin(request.user):
        return Response({"error": "Access denied. Admins only."}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(id=user_id)
        profile, _ = Profile.objects.get_or_create(user=user)

        profile.is_eligible = True
        profile.save()

        return Response({"message": f"User '{user.username}' marked as eligible."})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
