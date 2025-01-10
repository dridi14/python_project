from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import pandas as pd
import os

class SpotifyUserDataViewSet(viewsets.ViewSet):
    permission_classes = []
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'fav_music_genre', 'fav_pod_genre', 'spotify_listening_device', 'preferred_listening_content'
    ]
    ordering_fields = [
        'Age', 'music_lis_frequency', 'pod_lis_frequency', 'music_recc_rating'
    ]
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('fav_music_genre', openapi.IN_QUERY, description="Favorite Music Genre", type=openapi.TYPE_STRING),
            openapi.Parameter('fav_pod_genre', openapi.IN_QUERY, description="Favorite Podcast Genre", type=openapi.TYPE_STRING),
            openapi.Parameter('spotify_listening_device', openapi.IN_QUERY, description="Spotify Listening Device", type=openapi.TYPE_STRING),
            openapi.Parameter('preferred_listening_content', openapi.IN_QUERY, description="Preferred Listening Content", type=openapi.TYPE_STRING),
            openapi.Parameter('Age', openapi.IN_QUERY, description="Age", type=openapi.TYPE_STRING),
            openapi.Parameter('music_lis_frequency', openapi.IN_QUERY, description="Music Listening Frequency", type=openapi.TYPE_STRING),
            openapi.Parameter('pod_lis_frequency', openapi.IN_QUERY, description="Podcast Listening Frequency", type=openapi.TYPE_STRING),
            openapi.Parameter('music_recc_rating', openapi.IN_QUERY, description="Music Recommendation Rating", type=openapi.TYPE_STRING),
        ]
    )

    def get_dataset(self):
        """
        Load the dataset from a CSV file.
        """
        csv_path = os.path.join(settings.BASE_DIR, 'core/data/spotify_user_behavior.csv')
        return pd.read_csv(csv_path)

    @action(detail=False, methods=['get'], url_path='top-genres')
    def top_genres(self, request):
        """
        Get the most popular music genres.
        """
        df = self.get_dataset()
        top_genres = (
            df['fav_music_genre']
            .value_counts()
            .head(5)
            .reset_index()
            .rename(columns={'index': 'genre', 'fav_music_genre': 'count'})
        )
        top_genres.columns = ['genre', 'count']
        return Response(top_genres.to_dict(orient='records'))

    @action(detail=False, methods=['get'], url_path='demographic-data')
    def demographic_data(self, request):
        """
        Get user demographics.
        """
        df = self.get_dataset()
        demographics = (
            df.groupby(['Age', 'Gender', 'spotify_subscription_plan']).size().reset_index(name='count')
        )
        return Response(demographics.to_dict(orient='records'))

    @action(detail=False, methods=['get'], url_path='listening-habits')
    def listening_habits(self, request):
        """
        Get insights into listening habits (e.g., time slots, frequency).
        """
        df = self.get_dataset()
        habits = (
            df.groupby('music_time_slot')['music_lis_frequency']
            .mean()
            .reset_index()
            .rename(columns={'music_lis_frequency': 'avg_frequency'})
        )
        return Response(habits.to_dict(orient='records'))

    @action(detail=False, methods=['get'], url_path='podcast-insights')
    def podcast_insights(self, request):
        """
        Get podcast listening insights.
        """
        df = self.get_dataset()
        insights = (
            df.groupby(['fav_pod_genre', 'preffered_pod_format'])
            .agg(avg_recc_rating=('music_recc_rating', 'mean'),
                 avg_variety_satisfaction=('pod_variety_satisfaction', 'mean'))
            .reset_index()
        )
        return Response(insights.to_dict(orient='records'))

    @action(detail=False, methods=['get'], url_path='subscription-preferences')
    def subscription_preferences(self, request):
        """
        Get subscription plan preferences and willingness to upgrade.
        """
        df = self.get_dataset()
        preferences = (
            df.groupby(['spotify_subscription_plan', 'premium_sub_willingness'])
            .size()
            .reset_index(name='count')
        )
        return Response(preferences.to_dict(orient='records'))

    @action(detail=False, methods=['get'], url_path='discovery-methods')
    def discovery_methods(self, request):
        """
        Get preferred methods for discovering new music.
        """
        df = self.get_dataset()
        methods = (
            df['music_expl_method']
            .value_counts()
            .reset_index()
            .rename(columns={'index': 'method', 'music_expl_method': 'count'})
        )
        return Response(methods.to_dict(orient='records'))

    @action(detail=False, methods=['get'], url_path='top-devices')
    def top_devices(self, request):
        """
        Get the most popular Spotify listening devices.
        """
        df = self.get_dataset()
        top_devices = (
            df['spotify_listening_device']
            .value_counts()
            .reset_index()
            .rename(columns={'index': 'device', 'spotify_listening_device': 'count'})
        )
        top_devices.columns = ['device', 'count']
        return Response(top_devices.to_dict(orient='records'))
    
    @action(detail=False, methods=['get'], url_path='favorite-genres')
    def favorite_genres(self, request):
        """
        Get the most popular music genres grouped by age and gender.
        """
        df = self.get_dataset()
        # Group by ageGroup and gender
        favorite_genres = (
            df.groupby(['Age', 'Gender', 'fav_music_genre'])
            .size()
            .reset_index(name='count')
            .sort_values(by='count', ascending=False)
        )
        return Response(favorite_genres.to_dict(orient='records'))

    
    @action(detail=False, methods=['get'], url_path='podcast-preferences')
    def podcast_preferences(self, request):
        """
        Get the most popular podcast preferences (format, duration, and host type).
        """
        df = self.get_dataset()
        # Group by preferred podcast attributes
        podcast_preferences = (
            df.groupby(['preffered_pod_format', 'preffered_pod_duration', 'pod_host_preference'])
            .size()
            .reset_index(name='count')
            .sort_values(by='count', ascending=False)
        )
        return Response(podcast_preferences.to_dict(orient='records'))
