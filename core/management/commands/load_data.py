import kagglehub
import pandas as pd
import os
from core.models import SpotifyTrack
from django.core.management.base import BaseCommand

def get_data():
    path = kagglehub.dataset_download("gauthamvijayaraj/spotify-tracks-dataset-updated-every-week")
    for file in os.listdir(path):
        if file.endswith(".csv"):
            df = pd.read_csv(os.path.join(path, file))
            break
    print(len(df))
    # save to the database
    for index, row in df.iterrows():
        SpotifyTrack.objects.create(
            track_id=row['track_id'],
            track_name=row['track_name'],
            artist_name=row['artist_name'],
            year=row['year'],
            popularity=row['popularity'],
            artwork_url=row['artwork_url'],
            album_name=row['album_name'],
            acousticness=row['acousticness'],
            danceability=row['danceability'],
            duration_ms=row['duration_ms'],
            energy=row['energy'],
            instrumentalness=row['instrumentalness'],
            key=row['key'],
            liveness=row['liveness'],
            loudness=row['loudness'],
            mode=row['mode'],
            speechiness=row['speechiness'],
            tempo=row['tempo'],
            time_signature=row['time_signature'],
            valence=row['valence'],
            track_url=row['track_url'],
            language=row['language']
        )

class Command(BaseCommand):
    help = 'Load data from Kaggle'

    def handle(self, *args, **kwargs):
        get_data()
        self.stdout.write(self.style.SUCCESS('Successfully loaded data from Kaggle'))
    