from django.urls import path
from .views import (
    register,
    login,
    profile,
    select_role,
    update_profile,
    logout,
    application_stats  # ✅ NEW IMPORT
)

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('profile/', profile),
    path('update-profile/', update_profile),
    path('select-role/', select_role),
    path('logout/', logout),

    # ✅ NEW API
    path('applications/stats/', application_stats),
]