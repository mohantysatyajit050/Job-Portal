from django.urls import path
from .views import register, login, profile, select_role, update_profile

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('profile/', profile),
    path('update-profile/', update_profile),  # 🔥 NEW
    path('select-role/', select_role),
]