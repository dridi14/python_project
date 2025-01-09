from core.views import SpotifyTrackerViewSet
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'spotify-tracker', SpotifyTrackerViewSet, basename='spotify-tracker')

urlpatterns = [
    path('', include(router.urls))
]
