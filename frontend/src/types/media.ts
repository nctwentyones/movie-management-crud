export interface Media {
  id: number;
  type: 'movie' | 'series';
  title: string;
  year: number;
  director: string;
  genre: string;
  poster_url: string;
  created_at: string;
}