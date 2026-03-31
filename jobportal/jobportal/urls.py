from django.contrib import admin
from django.urls import path, include

# ✅ ADD THESE IMPORTS
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/core/', include('core.urls')),
    path('api/users/', include('users.urls')),
    path('api/jobs/', include('jobs.urls')),
]

# ✅ VERY IMPORTANT (ADD THIS AT END)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)