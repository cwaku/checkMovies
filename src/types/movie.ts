export interface Movie {
  id: number | string;
  title: string;
  release_year: number;
  actors: string | string[];
  created_at?: string;
}
