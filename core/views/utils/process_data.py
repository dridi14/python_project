import pandas as pd

# Processing Ideas for the Spotify Tracks Dataset
def get_processed_data():
    df = pd.read_csv("core/data/spotify_tracks.csv")
    df = df.dropna()
    df = df.drop_duplicates()


