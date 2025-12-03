// lay byte lon nhat
use aiken/primitive/bytearray

fn max_byte(a: ByteArray) -> Int {
  bytearray.foldl(a, 0, fn(byte, acc) {
    if byte > acc { byte } else { acc }
  })
}

test max_byte_test() {
  max_byte(#"0a1bff22") == 255
}

// Dem so byte chan
use aiken/primitive/bytearray

fn count_even_bytes(a: ByteArray) -> Int {
  bytearray.foldl(a, 0, fn(byte, acc) {
    if byte % 2 == 0 { acc + 1 } else { acc }
  })
}

test count_even_bytes_test() {
  count_even_bytes(#"01020304ff") == 2
}
//ktra 2 byte  giong nhau
use aiken/primitive/bytearray

fn equal_bytes(a: ByteArray, b: ByteArray) -> Bool {
  if bytearray.length(a) != bytearray.length(b) {
    False
  } else {
    equal_helper(a, b, 0)
  }
}

fn equal_helper(a: ByteArray, b: ByteArray, idx: Int) -> Bool {
  if idx == bytearray.length(a) {
    True
  } else if bytearray.at(a, idx) != bytearray.at(b, idx) {
    False
  } else {
    equal_helper(a, b, idx + 1)
  }
}

test equal_bytes_test() {
  equal_bytes(#"aabb", #"aabb")
}
// lat bit cua byte
use aiken/primitive/bytearray

fn invert_bytes(a: ByteArray) -> ByteArray {
  bytearray.foldl(
    a,
    #"",
    fn(byte, acc) {
      let inverted = 255 - byte
      bytearray.push(acc, inverted)
    }
  )
}

test invert_bytes_test() {
  invert_bytes(#"00ff") == #"ff00"
}
//Đếm số byte lớn hơn 128 trong ByteArray

use aiken/primitive/bytearray

fn count_bytelarge(a: ByteArray) -> Int {
  bytearray.foldl(
    a,
    0,
    fn(byte, acc) {
      if byte > 128 {
        acc + 1
      } else {
        acc
      }
    },
  )
}

test c_bl() {
  count_bytelarge(#"aabbff") == 3
}
//Viết hàm trả về số byte khác nhau giữa hai ByteArray cùng độ dài:

use aiken/primitive/bytearray

fn count_diffient(a: ByteArray, b: ByteArray) -> Int {
  if bytearray.length(a) != bytearray.length(b) {
    0
  } else {
    if bytearray.length(a) > 0 {
      ss(a, b) + count_diffient(
        bytearray.slice(a, 1, bytearray.length(a) - 1),
        bytearray.slice(b, 1, bytearray.length(b) - 1),
      )
    } else {
      0
    }
  }
}

fn ss(a: ByteArray, b: ByteArray) -> Int {
  let byte_a: ByteArray = bytearray.slice(a, 0, 0)
  let byte_b: ByteArray = bytearray.slice(b, 0, 0)

  if byte_a != byte_b {
    1
  } else {
    0
  }
}

test count_diffient_test() {
  and {
    count_diffient(#"aabb", #"aabb") == 0,
    count_diffient(#"aabb", #"aacc") == 1,
    count_diffient(#"112233", #"113333") == 1,
  }
}
