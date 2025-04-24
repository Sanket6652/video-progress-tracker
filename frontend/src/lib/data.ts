// API Interface definitions
export interface Video {
  _id: string;
  title: string;
  description: string;
  videourl: string;
  thumbnail: string;
  duration: number;
}

// API response types
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// API client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API client class
class VideoApiClient {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  }

  async getVideos(): Promise<Video[]> {
    return this.fetchApi<Video[]>('/videos');
  }

  async getVideoById(id: string): Promise<Video> {
    return this.fetchApi<Video>(`/videos/${id}`);
  }
}

// Export singleton instance
export const videoApi = new VideoApiClient();

// Export convenience methods
export const getVideos = () => videoApi.getVideos();
export const getVideoById = (id: string) => videoApi.getVideoById(id);