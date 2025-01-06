from core.views import SpotifyTrackerViewSet
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'spotify-tracker', SpotifyTrackerViewSet)

urlpatterns = [
    path('', include(router.urls))
]
