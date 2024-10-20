interface Position {
  row: number;
  col: number;
}

interface Board {
  last_cell_id: number;
  grid: Cell[][];
}

interface StartGameRequest {
  session_id: string;
  board: Board;
  players_score: Record<string, number>;
  score: number;
  is_active: boolean;
  status: string;
  players_i_ds: number[];
  duration: number;
  started_at: string;
  created_at: string;
  updated_at: string;
}