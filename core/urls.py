from core.views import SpotifyTrackerViewSet, SpotifyUserDataViewSet
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'spotify-tracker', SpotifyTrackerViewSet, basename='spotify-tracker')
router.register(r'spotify-user-data', SpotifyUserDataViewSet, basename='spotify-user-data')

urlpatterns = [
    path('', include(router.urls))
]
