from rest_framework import serializers
from core.models import SpotifyTrack

class SpotifyTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotifyTrack
        fields = '__all__'
