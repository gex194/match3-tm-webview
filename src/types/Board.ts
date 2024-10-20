interface Board {
  last_cell_id: number;
  grid: Cell[][];
}

interface Cell {
  id: number;
  position: Position;
  is_new: boolean;
  type: string;
}

interface Position {
  row: number;
  col: number;
}
