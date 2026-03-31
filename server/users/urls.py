from django.urls import path
from .views import signup_vendor

urlpatterns = [
    path('signup/', signup_vendor),
]