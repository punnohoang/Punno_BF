// use aiken/primitive/bytearray

// fn cell_to_number(cell: ByteArray) -> Int {
//   let col = bytearray.at(cell, 0) - 64
//   let row = bytearray.at(cell, 1) - 48
//   col + row
// }

// fn chessBoardCellColor(cell1: ByteArray, cell2: ByteArray) -> Bool {
//   let sum1 = cell_to_number(cell1)
//   let sum2 = cell_to_number(cell2)
//   sum1 % 2 == sum2 % 2
// }

// test test_bai4() {
//   and {
//     chessBoardCellColor("A1", "C3") == True,
//     chessBoardCellColor("A1", "H3") == False,
//     chessBoardCellColor("B2", "D4") == True,
//     chessBoardCellColor("A2", "A4") == True,
//     chessBoardCellColor("B1", "C3") == False,
//     chessBoardCellColor("H8", "A1") == True,
//     chessBoardCellColor("F5", "F6") == False,
//     chessBoardCellColor("D1", "G4") == True,
//     chessBoardCellColor("C1", "E2") == False,
//     chessBoardCellColor("H1", "H2") == False,
//   }
// }
