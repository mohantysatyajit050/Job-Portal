from django.urls import path
from .views import (
    register, login, profile, select_role, update_profile, logout,

    # 🔥 ADMIN APIs
    admin_get_users,
    admin_approve_user,
    admin_delete_user,
    admin_mark_eligible
)

urlpatterns = [
    # 🔹 AUTH APIs
    path('register/', register),
    path('login/', login),
    path('profile/', profile),
    path('update-profile/', update_profile),
    path('select-role/', select_role),
    path('logout/', logout),

    # =========================
    # 🔥 ADMIN ROUTES
    # =========================
    path('admin/users/', admin_get_users),
    path('admin/approve/<int:user_id>/', admin_approve_user),
    path('admin/delete/<int:user_id>/', admin_delete_user),
    path('admin/eligible/<int:user_id>/', admin_mark_eligible),
]