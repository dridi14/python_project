from rest_framework import viewsets, filters
from core.models import SpotifyTrack
from core.serializers import SpotifyTrackerSerializer


class SpotifyTrackerViewSet(viewsets.ModelViewSet):
    queryset = SpotifyTrack.objects.all()
    serializer_class = SpotifyTrackerSerializer
