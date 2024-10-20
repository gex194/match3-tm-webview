type Grid = {
  position: { row: number; col: number }
  is_new: Boolean
  type: string
}
//
// /* Определение интерфейсов и типов */
//
// interface Position {
//   x: number
//   y: number
// }
//
// //
// interface GridPosition {
//   row: number
//   col: number
// }
//
// interface SpriteData {
//   id: string
//   name: string
//   anchor: Position
//   isNew: boolean
//   position: Position
//   positionGrid: GridPosition
//   texture: string
//   scale: Position
//   isAnimating: boolean
//   startTime: number
//   isAppearing: boolean
// }
//
// interface SelectionState {
//   current: SpriteData | null
//   buffer: Position | null
//   next: SpriteData | null
//   nextBuffer: Position | null
// }
//
// interface Flags {
//   deleted: boolean
//   isMoveSuccessful: boolean
// }

// interface GameState {
//   board: {
//     grid: any[][]
//   }
//   duration: number
//   score: number
// }
