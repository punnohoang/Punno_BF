fn is_prime(n: Int, divisor: Int) -> Bool {
  if n <= 1 {
    False
  } else if divisor * divisor > n {
    True
  } else if n % divisor == 0 {
    False
  } else {
    is_prime(n, divisor + 1)
  }
}

pub fn prime(n: Int) -> Bool {
  is_prime(n, 2)
}

test prime_test() {
  and {
    prime(7),
    !prime(8),
  }
}
