use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction}
use vodka_extra_signatories.{key_signed}
use vodka_validity_range.{valid_after}

pub type Datum {
  owner: VerificationKeyHash,
  beneficiary: VerificationKeyHash,
  lock_until: Int,
}

validator vesting {
  spend(
    datum_opt: Option<Datum>,
    _redemer: Data,
    tx: Transaction,
    _out_ref: OutputReference,
  ) {
    expect Some(datum) = datum_opt
    or {
      key_signed(tx.extra_signatories, datum.owner),
      and {
        key_signed(tx.extra_signatories, datum.beneficiary),
        valid_after(tx.validity_range, datum.lock_until),
      },
    }
  }

  else(_) {
    fail
  }
}
