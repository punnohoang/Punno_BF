// ////////////////////
// // Bài 5: Beautiful String
// ////////////////////

// use aiken/collection/list

// // Helper: tìm chỉ số chữ cái cao nhất (từ 0..25) có xuất hiện
// fn find_max_idx(i: Int, counts: List<Int>) -> Int {
//   -1
// }

// // Kiểm tra tất cả chỉ số i..max_idx có giá trị > 0
// fn all_nonzero(i: Int, max_idx: Int, counts: List<Int>) -> Bool {
//   if i > max_idx {
//     True
//   } else if list::at(counts, i) == 0 {
//     False
//   } else {
//     all_nonzero(i + 1, max_idx, counts)
//   }
// }

// // Kiểm tra giảm dần (hoặc bằng) từ i tới max_idx
// fn nonincreasing(i: Int, max_idx: Int, counts: List<Int>) -> Bool {
//   if i >= max_idx {
//     True
//   } else if list::at(counts, i + 1) > list::at(counts, i) {
//     False
//   } else {
//     nonincreasing(i + 1, max_idx, counts)
//   }
// }

// /// Kiểm tra chuỗi "đẹp":
// /// - Phải có đủ các chữ cái từ 'a' đến chữ cái cao nhất xuất hiện
// /// - Số lần xuất hiện giảm dần (hoặc bằng) từ 'a' → 'z'
// pub fn is_beautiful_string(input: ByteArray) -> Bool {
//   let counts = count_letters(input)

//   // 1. Tìm chỉ số chữ cái cao nhất có xuất hiện
//   let max_idx = find_max_idx(25, counts)

//   if max_idx == -1 {
//     True
//   } else {
//     if all_nonzero(0, max_idx, counts) {
//       nonincreasing(0, max_idx, counts)
//     } else {
//       False
//     }
//   }
// }

// // Đếm số lần xuất hiện của từng chữ cái 'a'..'z'
// fn count_letters(s: ByteArray) -> List<Int> {
//   let mut counts = list::repeat(0, 26)
//   each byte in bytearray::to_list(s) {
//     if byte >= 97 && byte <= 122 {          // 'a'..'z'
//       let idx = byte - 97
//       let cur = list::at(counts, idx)
//       counts = set(counts, idx, cur + 1)
//     }
//   }
//   counts
// }

// // Helper: Cập nhật phần tử trong List
// fn set<a>(lst: List<a>, idx: Int, val: a) -> List<a> {
//   list::map_with_index(lst, fn(i, _) {
//     if i == idx { val } else { list::at(lst, i) }
//   })
// }

// test init(){
//     is_beautiful_string(#"bbbaacdafe") == True &&
//     is_beautiful_string(#"aabbb")       == False &&
//     is_beautiful_string(#"bbc")         == False &&
//     is_beautiful_string(#"aabbcc")      == True &&
//     is_beautiful_string(#"abc")         == True &&
//     is_beautiful_string(#"abcc")        == False &&
//     is_beautiful_string(#"zzz")         == False &&
//     is_beautiful_string(#"a")           == True &&
//     is_beautiful_string(#"abca")        == False &&
//     is_beautiful_string(#"aabbccc")     == False
// }
