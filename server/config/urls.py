from django.contrib import admin
from django.urls import path, include
from users.views import signup_vendor
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth APIs
    path('api/users/', include('users.urls')),
    path('api/auth/', TokenObtainPairView.as_view()),

    # Product APIs (we'll add next)
    path('api/', include('inventory.urls')),
]