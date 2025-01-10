import pandas as pd
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import action
from drf_yasg import openapi

DATAFRAME = pd.read_csv("core/data/spotify_tracks.csv")

class SpotifyTrackerViewSet(ViewSet):
    permission_classes = []

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('year', openapi.IN_QUERY, description="Year Filter", type=openapi.TYPE_STRING),
            openapi.Parameter('artist', openapi.IN_QUERY, description="Artist Filter", type=openapi.TYPE_STRING),
            openapi.Parameter('genre_language', openapi.IN_QUERY, description="Genre and Language Grouping", type=openapi.TYPE_STRING),
            openapi.Parameter('duration', openapi.IN_QUERY, description="Duration Grouping", type=openapi.TYPE_STRING),
            openapi.Parameter('acoustic_instrumental', openapi.IN_QUERY, description="Acousticness and Instrumentalness", type=openapi.TYPE_STRING),
            openapi.Parameter('energy_tempo', openapi.IN_QUERY, description="Energy and Tempo", type=openapi.TYPE_STRING),
            openapi.Parameter('key_mode', openapi.IN_QUERY, description="Key and Mode Grouping", type=openapi.TYPE_STRING),
            openapi.Parameter('popularity', openapi.IN_QUERY, description="Popularity Range Filter", type=openapi.TYPE_STRING),
            openapi.Parameter('tempo', openapi.IN_QUERY, description="Tempo Range Filter", type=openapi.TYPE_STRING),
            openapi.Parameter('valence', openapi.IN_QUERY, description="Valence Range Filter", type=openapi.TYPE_STRING),
            openapi.Parameter('danceability', openapi.IN_QUERY, description="Danceability Range Filter", type=openapi.TYPE_STRING),
            openapi.Parameter('loudness', openapi.IN_QUERY, description="Loudness Range Filter", type=openapi.TYPE_STRING),
            openapi.Parameter('language', openapi.IN_QUERY, description="Language Filter", type=openapi.TYPE_STRING),
            openapi.Parameter('top', openapi.IN_QUERY, description="Top N Results", type=openapi.TYPE_STRING),
            openapi.Parameter('aggregate', openapi.IN_QUERY, description="Aggregation", type=openapi.TYPE_STRING),
            openapi.Parameter('sort', openapi.IN_QUERY, description="Sorting", type=openapi.TYPE_STRING),
            openapi.Parameter('ascending', openapi.IN_QUERY, description="Sort Order", type=openapi.TYPE_STRING),
            openapi.Parameter('top_column', openapi.IN_QUERY, description="Top Column", type=openapi.TYPE_STRING),
            openapi.Parameter('top_n', openapi.IN_QUERY, description="Top N", type=openapi.TYPE_STRING),
            openapi.Parameter('exact', openapi.IN_QUERY, description="Exact Match for Artist Filter", type=openapi.TYPE_BOOLEAN),
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
    @action(detail=False, methods=["get"], url_path="popularity-trends")
    def popularity_trends(self, request):
        """Endpoint for Popularity Trends"""
        try:
            trends = DATAFRAME.groupby('year')['popularity'].mean().reset_index()
            return Response(trends.to_dict(orient='records'))
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="genre-language")
    def genre_language(self, request):
        """Endpoint for Genre and Language Stats"""
        top_n = int(request.GET.get('top_n', 5))
        try:
            stats = DATAFRAME.groupby(['genre', 'language']).mean().reset_index()
            stats = stats.nlargest(top_n, 'popularity')
            return Response(stats.to_dict(orient='records'))
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"])
    def track_features(self, request):
        """Endpoint for Track Features"""
        acoustic_instrumental = request.GET.get('acoustic_instrumental', 'false').lower() == 'true'
        try:
            if acoustic_instrumental:
                features = DATAFRAME[['track_name', 'acousticness', 'instrumentalness']]
            else:
                features = DATAFRAME[['track_name', 'energy', 'tempo']]
            return Response(features.to_dict(orient='records'))
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"])
    def custom_insights(self, request):
        """Endpoint for Custom Insights"""
        filters = request.GET
        try:
            filters = {k: v for k, v in filters.items() if v}  # Remove empty filters
            filtered_data = self.apply_filters(DATAFRAME, filters)
            return Response(filtered_data.to_dict(orient='records'))
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def apply_filters(self, df, filters):
        # Year Filter
        if 'year' in filters:
            year_filter = filters['year']
            if '-' in year_filter:
                start_year, end_year = map(int, year_filter.split('-'))
                df = df[(df['year'] >= start_year) & (df['year'] <= end_year)]
            else:
                df = df[df['year'] == int(year_filter)]
        
        # Artist Filter
        if 'artist' in filters:
            artist_filter = filters['artist']
            if filters.get('exact', False):
                df = df[df['artist_name'].str.lower() == artist_filter.lower()]
            else:
                df = df[df['artist_name'].str.contains(artist_filter, case=False, na=False)]
        
        # Genre and Language Grouping
        if 'genre_language' in filters:
            top_n = int(filters.get('top_n', 5))
            df = df.groupby(['genre', 'language']).mean().reset_index()
            df = df.nlargest(top_n, 'popularity')
        
        # Duration Grouping
        if 'duration' in filters:
            df = df[['artist_name', 'album_name', 'duration_ms']].groupby(['artist_name', 'album_name']).mean().reset_index()
        
        # Acousticness and Instrumentalness
        if 'acoustic_instrumental' in filters:
            df = df[['track_name', 'acousticness', 'instrumentalness']]
        
        # Energy and Tempo
        if 'energy_tempo' in filters:
            df = df[['track_name', 'energy', 'tempo']]
        
        # Key and Mode Grouping
        if 'key_mode' in filters:
            df = df.groupby(['key', 'mode']).mean().reset_index()
        
        # Range Filters
        def apply_range_filter(column, range_filter):
            min_val, max_val = map(float, range_filter.split('-'))
            return df[df[column].between(min_val, max_val)]
        
        if 'popularity' in filters:
            df = apply_range_filter('popularity', filters['popularity'])
        
        if 'tempo' in filters:
            df = apply_range_filter('tempo', filters['tempo'])
        
        if 'valence' in filters:
            df = apply_range_filter('valence', filters['valence'])
        
        if 'danceability' in filters:
            df = apply_range_filter('danceability', filters['danceability'])
        
        if 'loudness' in filters:
            df = apply_range_filter('loudness', filters['loudness'])
        
        # Language Filter
        if 'language' in filters:
            df = df[df['language'].isin(filters['language'].split(','))]
        
        # Top N Results
        if 'top' in filters:
            column = filters.get('top_column', 'popularity')
            top_n = int(filters.get('top_n', 10))
            df = df.nlargest(top_n, column)
        
        # Aggregation
        if 'aggregate' in filters:
            group_by = filters.get('group_by', 'artist_name')
            df = df.groupby(group_by).mean().reset_index()
        
        # Sorting
        if 'sort' in filters:
            sort_by = filters['sort']
            ascending = filters.get('ascending', 'true') == 'true'
            df = df.sort_values(by=sort_by, ascending=ascending)
        
        return df
