import kagglehub
import pandas as pd
import os
from django.core.management.base import BaseCommand

def get_data():
    path = kagglehub.dataset_download("gauthamvijayaraj/spotify-tracks-dataset-updated-every-week")
    for file in os.listdir(path):
        if file.endswith(".csv"):
            df = pd.read_csv(os.path.join(path, file))
            break
    # save to a csv file
    df.to_csv("core/data/spotify_tracks.csv", index=False)

    ## behaviour data set
    path = kagglehub.dataset_download("meeraajayakumar/spotify-user-behavior-dataset")
    for file in os.listdir(path):
        if file.endswith(".xlsx"):
            df = pd.read_excel(os.path.join(path, file))
            break
    # save to a csv file
    df.to_csv("core/data/spotify_user_behavior.csv", index=False)

class Command(BaseCommand):
    help = 'Load data from Kaggle'

    def handle(self, *args, **kwargs):
        get_data()
        self.stdout.write(self.style.SUCCESS('Successfully loaded data from Kaggle'))
    