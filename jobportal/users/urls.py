from django.urls import path
from .views import register, login, profile, select_role, update_profile, logout

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('profile/', profile),
    path('update-profile/', update_profile),
    path('select-role/', select_role),
    path('logout/', logout),  # Add this line
]