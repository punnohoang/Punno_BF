use aiken/collection/list

fn bai2(l: List<Int>) -> Int {
    foldl(l, 0, fn(x, acc) acc + x)
}

test test_bai2(){
    let l: List<Int> = [1, 2, 3]
    bai2(l) == 6
}
