export interface Media {
  id: number;
  type: 'movie' | 'series';
  title: string;
  year: number;
  director: string;
  genre_id: number; 
  genre_name: string;    
  poster_url: string;
  created_at: string;
}