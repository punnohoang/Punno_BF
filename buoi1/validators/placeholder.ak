// use aiken/bool
// test foo() {
//   let x = 5
//   let y: Int = x + 10
//   let z: ByteArray = #"12345abc"
//   let w: String = @"Hello, World!"
//   //x + 10 == y || x + 5 == y
//   and {
//     x + 10 == y,
//     x + 5 == y,
//   }
// }
//####################################
// fn sum(a, b) {
//   a + b
// }

// fn sum1(a: Int, b: Int) -> Int {
//   a + b
// }

// fn sum2(n: Int) -> Int {
//   if n <= 1 {
//     1
//   } else {
//     n * sum2(n - 1)
//   }
// }

// test function() {
//   let rs = sum(3, 7)
//   let rs1 = sum1(4, 6)
//   let rs2 = sum2(5)
//   rs2 == 120 && rs1 == 10 && rs == 10
// }
//####################################

// fn sum(n: Int) -> Int {
//   n
// }

// fn maximum(List<Int> datum, redeemer) -> Int {
//   let total = sum(datum)
//   let max = total / 4
//   max
// }

// test fumtion() {
//   let datum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//   let redeemer = 5
//   let rs = maximum(datum, redeemer)
//   rs == 5
// }

// use aiken/num

// pub fn easy_num(n: Int) -> Bool {
//   let a = n / 100
//   let b = n / 10 % 10
//   let c = n % 10
//   if a < 1 || c < 1 || b < 0 || n < 100 || n > 999 {
//     False
//   } else {
//     let power = num.pow(a, b)
//     let div = power / c
//     div % a == 0
//   }
// }
use aiken/collection/list
use aiken/primitive/int


fn testlist(list: List<Int>) -> List<Int>{
  list.sort(list, int.compare)
}
//tupple
fn sum(a: Int, b: Int)-> Int{
  a + b
}

test init(){
  // let x = [4,3,1,5]
  // let sum = list.foldl(x, 0, fn(xs, acc){
  //   xs + acc
  // })
  let b = Some(5)
  let a = when b is{
    Some(x) -> x 
    _ -> 0
  }
  a == 5


}
// fn sum(a, b){
//   a + b
// }
// fn sum2(a: Int, b: Int)-> Int{
//   a + b
// }
// fn sum3(n: Int)-> Int{
//   if n == 0{
//     0
//   }
//   else{
//     n + sum3(n - 1)
//   }
// }
// fn add_one(x: Int)-> Int{
//   x + 1
// }
// fn twice(f: fn(t) -> t, x: t)-> t{
//   f(f(x))
// }
// fn add_two(x: Int)-> Int{
//   twice(add_one, x)
// }

// test function(){
//   add_two(5) == 7
// }
// // test foo(){
// //   let x = 5
// //   let y: Int = x + 10
// //   let z: ByteArray = "123abc"
// //   let d: String = @"Hello World"
// //   and{
// //     x + 10 == y,
// //     x + 5 == y
// //   }
// // }
// // test init(){
// //   5 == 6
// // }

test num(){
  let a=10
  let b=2
  a=a+b
  a==12
}

use aiken/primitive/int

fn factorial(n: Int) -> Int {
  if n == 0 {
    1
  } else {
    n * factorial(n - 1)
  }
}

test factorial_test() {
  factorial(5) == 120
}
