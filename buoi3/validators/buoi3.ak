use cardano/transaction.{OutputReference, Transaction}

pub type Datum {
  secret: ByteArray,
}

pub type Redeemer {
  guess: ByteArray,
}

validator lock_unlock {
  spend(
    datum: Option<Datum>,
    redeemer: Redeemer,
    _input: OutputReference,
    _tx: Transaction,
  ) {
    // Chỉ mở khóa được khi secret trong datum bằng guess trong redeemer
    expect Some(Datum { secret }) = datum
    secret == redeemer.guess
  }

  else(_) {
    fail
  }
}

test unlock_with_correct_secret() {
  let datum = Some(Datum { secret: "123" })
  let redeemer = Redeemer { guess: "123" }
  let output_ref = OutputReference { transaction_id: "", output_index: 0 }
  let tx = transaction.placeholder
  lock_unlock.spend(datum, redeemer, output_ref, tx)
}
