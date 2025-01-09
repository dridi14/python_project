import pandas as pd
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

DATAFRAME = pd.read_csv("core/data/spotify_tracks.csv")

class SpotifyTrackerViewSet(ViewSet):
    permission_classes = []

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('year', openapi.IN_QUERY, description="Filter by year or range", type=openapi.TYPE_STRING),
            openapi.Parameter('artist', openapi.IN_QUERY, description="Filter by artist name", type=openapi.TYPE_STRING),
            openapi.Parameter('genre_language', openapi.IN_QUERY, description="Analyze genre and language correlation", type=openapi.TYPE_STRING),
            openapi.Parameter('duration', openapi.IN_QUERY, description="Analyze song duration distribution", type=openapi.TYPE_STRING),
            openapi.Parameter('acoustic_instrumental', openapi.IN_QUERY, description="Analyze acousticness and instrumentalness", type=openapi.TYPE_STRING),
            openapi.Parameter('energy_tempo', openapi.IN_QUERY, description="Analyze energy and tempo relationship", type=openapi.TYPE_STRING),
            openapi.Parameter('key_mode', openapi.IN_QUERY, description="Analyze key and mode relationship", type=openapi.TYPE_STRING),
            openapi.Parameter('popularity', openapi.IN_QUERY, description="Filter by popularity range", type=openapi.TYPE_STRING),
            openapi.Parameter('language', openapi.IN_QUERY, description="Filter by language", type=openapi.TYPE_STRING),
            openapi.Parameter('tempo', openapi.IN_QUERY, description="Filter by tempo range", type=openapi.TYPE_STRING),
            openapi.Parameter('valence', openapi.IN_QUERY, description="Filter by valence range", type=openapi.TYPE_STRING),
            openapi.Parameter('danceability', openapi.IN_QUERY, description="Filter by danceability range", type=openapi.TYPE_STRING),
            openapi.Parameter('loudness', openapi.IN_QUERY, description="Filter by loudness range", type=openapi.TYPE_STRING),
        ]
    )
    def list(self, request):
        global DATAFRAME
        filters = request.GET
        try:
            if not filters:
                return Response(DATAFRAME.to_dict(orient='records'))
            # remove empty filters
            filters = {k: v for k, v in filters.items() if v}
            filtered_data = self.apply_filters(DATAFRAME, filters)
            return Response(filtered_data.to_dict(orient='records'))
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def apply_filters(self, df, filters):
        """Apply custom filters to the DataFrame."""
        if 'year' in filters:
            year_filter = filters['year']
            if '-' in year_filter:
                start_year, end_year = map(int, year_filter.split('-'))
                df = df[(df['year'] >= start_year) & (df['year'] <= end_year)]
            else:
                df = df[df['year'] == int(year_filter)]

        if 'artist' in filters:
            df = df[df['artist_name'].str.contains(filters['artist'], case=False, na=False)]

        if 'genre_language' in filters:
            df = df.groupby(['genre', 'language']).mean().reset_index()

        if 'duration' in filters:
            df = df.groupby(['artist_name', 'album_name']).mean().reset_index()

        if 'acoustic_instrumental' in filters:
            df = df[['acousticness', 'instrumentalness']]

        if 'energy_tempo' in filters:
            df = df[['energy', 'tempo']]

        if 'key_mode' in filters:
            df = df.groupby(['key', 'mode']).mean().reset_index()

        if 'popularity' in filters:
            min_pop, max_pop = map(int, filters['popularity'].split('-'))
            df = df[df['popularity'].between(min_pop, max_pop)]

        if 'language' in filters:
            df = df[df['language'].isin(filters['language'].split(','))]

        if 'tempo' in filters:
            min_tempo, max_tempo = map(float, filters['tempo'].split('-'))
            df = df[df['tempo'].between(min_tempo, max_tempo)]

        if 'valence' in filters:
            min_valence, max_valence = map(float, filters['valence'].split('-'))
            df = df[df['valence'].between(min_valence, max_valence)]

        if 'danceability' in filters:
            min_dance, max_dance = map(float, filters['danceability'].split('-'))
            df = df[df['danceability'].between(min_dance, max_dance)]

        if 'loudness' in filters:
            min_loud, max_loud = map(float, filters['loudness'].split('-'))
            df = df[df['loudness'].between(min_loud, max_loud)]

        return df
