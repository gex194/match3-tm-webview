

interface Match {
  direction: string;
  score: number;
  combo: number;
  cells: Cell[];
}

interface Board {
  last_cell_id: number;
  grid: Cell[][];
}

interface MakeMoveResponse {
  session_id: string;
  success: boolean;
  session_status: string;
  new_cells: Cell[];
  matches: Match[];
  score: number;
  board: Board;
}