from django.db import models

# Create your models here.

class SpotifyTrack(models.Model):
    track_id = models.CharField(max_length=255)
    track_name = models.CharField(max_length=255)
    artist_name = models.CharField(max_length=255)
    year = models.IntegerField()
    popularity = models.IntegerField()
    artwork_url = models.URLField()
    album_name = models.CharField(max_length=255)
    acousticness = models.FloatField()
    danceability = models.FloatField()
    duration_ms = models.IntegerField()
    energy = models.FloatField()
    instrumentalness = models.FloatField()
    key = models.IntegerField()
    liveness = models.FloatField()
    loudness = models.FloatField()
    mode = models.IntegerField()
    speechiness = models.FloatField()
    tempo = models.FloatField()
    time_signature = models.IntegerField()
    valence = models.FloatField()
    track_url = models.URLField()
    language = models.CharField(max_length=255)
    
    
    def __str__(self):
        return self.track_name