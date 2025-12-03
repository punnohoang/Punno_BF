// Dem so chu so
fn count_digits(n: Int) -> Int {
  if n < 10 {
    1
  } else {
    1 + count_digits(n / 10)
  }
}

test count_digits_test() {
  count_digits(12345) == 5
}

// dao so nguyen 
fn reverse_int(n: Int) -> Int {
  reverse_helper(n, 0)
}

fn reverse_helper(n: Int, acc: Int) -> Int {
  if n == 0 {
    acc
  } else {
    reverse_helper(n / 10, acc * 10 + n % 10)
  }
}

test reverse_int_test() {
  reverse_int(1234) == 4321
}

//tong chu so
fn sum_digits(n: Int) -> Int {
  if n < 10 {
    n
  } else {
    n % 10 + sum_digits(n / 10)
  }
}

test sum_digits_test() {
  sum_digits(1234) == 10
}
