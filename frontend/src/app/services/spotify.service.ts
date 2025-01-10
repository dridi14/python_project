import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private baseTrackerUrl = 'http://localhost:8000/api/spotify-tracker';
  private baseUserUrl = 'http://localhost:8000/api/spotify-user-data';

  constructor(private http: HttpClient) {}

  /**
   * Fetch data with general filters
   * @param filters Key-value pairs of filter parameters
   * @returns Observable with filtered data
   */
  getFilteredData(filters: any): Observable<any> {
    let params = new HttpParams();
    for (const key in filters) {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    return this.http.get(`${this.baseTrackerUrl}`, { params });
  }

  /**
   * Fetch popularity trends
   * @returns Observable with yearly popularity trends
   */
  getPopularityTrends(): Observable<any> {
    return this.http.get(`${this.baseTrackerUrl}/popularity-trends`);
  }

  /**
   * Fetch genre and language statistics
   * @param topN Number of top genres/languages to fetch
   * @returns Observable with genre and language stats
   */
  getGenreLanguageStats(topN: number = 5): Observable<any> {
    return this.http.get(`${this.baseTrackerUrl}/genre-language`, {
      params: new HttpParams().set('top_n', topN.toString()),
    });
  }

  /**
   * Fetch track features
   * @param acousticInstrumental Whether to fetch acoustic/instrumental features
   * @returns Observable with track features
   */
  getTrackFeatures(acousticInstrumental: boolean = false): Observable<any> {
    return this.http.get(`${this.baseTrackerUrl}/track-features`, {
      params: new HttpParams().set('acoustic_instrumental', acousticInstrumental.toString()),
    });
  }

  /**
   * Fetch custom insights
   * @param filters Key-value pairs of filter parameters
   * @returns Observable with custom insights
   */
  getCustomInsights(filters: any): Observable<any> {
    let params = new HttpParams();
    for (const key in filters) {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    return this.http.get(`${this.baseTrackerUrl}/custom`, { params });
  }


    /**
   * Fetch top genres
   * @returns Observable with top genres
   */
  getTopGenres(): Observable<any> {
    return this.http.get(`${this.baseUserUrl}/top-genres`);
  }

  /**
   * Fetch demographic data
   * @returns Observable with demographic data
   */
  getDemographicData(): Observable<any> {
    return this.http.get(`${this.baseUserUrl}/demographic-data`);
  }

  /**
   * Fetch listening habits
   * @returns Observable with listening habits
   */
  getListeningHabits(): Observable<any> {
    return this.http.get(`${this.baseUserUrl}/listening-habits`);
  }

  /**
   * Fetch podcast insights
   * @returns Observable with podcast insights
   */
  getPodcastInsights(): Observable<any> {
    return this.http.get(`${this.baseUserUrl}/podcast-insights`);
  }

  /**
   * Fetch subscription preferences
   * @returns Observable with subscription preferences
   */
  getSubscriptionPreferences(): Observable<any> {
    return this.http.get(`${this.baseUserUrl}/subscription-preferences`);
  }

  /**
   * Fetch discovery methods
   * @returns Observable with discovery methods
   */
  getDiscoveryMethods(): Observable<any> {
    return this.http.get(`${this.baseUserUrl}/discovery-methods`);
  }

  /**
   * Fetch top devices
   * @returns Observable with top devices
   */
  getTopDevices(): Observable<any> {
    return this.http.get(`${this.baseUserUrl}/top-devices`);
  }

  /**
   * Fetch podcast preferences
   * @returns Observable with podcast preferences
   */
  getFavoriteGenres(): Observable<any> {
    return this.http.get(`${this.baseUserUrl}/favorite-genres`);
  }

  /**
   * Fetch podcast preferences
   * @returns Observable with podcast preferences
  */
  getPodcastPreferences(): Observable<any> {
    return this.http.get(`${this.baseUserUrl}/podcast-preferences`);
  }
}
