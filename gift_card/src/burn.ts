import {
    builtinByteString,
    BuiltinByteString,
    Integer,
    List,
    mConStr1,
    outputReference,
    stringToHex,
} from "@meshsdk/common";
import {
    deserializeDatum,
    resolveScriptHash,
    UTxO,
} from "@meshsdk/core";
import { applyParamsToScript } from "@meshsdk/core-cst";
import { readValidator, wallet, getWalletInfoForTx, getTxBuilder, blockchainProvider } from "./common";

async function main() {

    const txhash = "54c7f122257c1aaf960c52adcab6eb5f0914305a3d16aff5d87ef1d92bb1767b";

    const { utxos, walletAddress, collateral } = await getWalletInfoForTx(wallet);

    const giftCardUtxos = await blockchainProvider.fetchUTxOs(txhash);
    if (giftCardUtxos.length === 0) throw new Error("Gift card UTxO not found");

    const giftCardUtxo = giftCardUtxos.find(utxo => utxo.output.plutusData !== undefined);
    if (!giftCardUtxo) {
        console.log("All UTxOs:", giftCardUtxos.map(u => ({
            txHash: u.input.txHash,
            outputIndex: u.input.outputIndex,
            address: u.output.address,
            hasPlutusData: u.output.plutusData !== undefined
        })));
        throw new Error("No UTxO with plutusData found - make sure the script UTxO exists");
    }

    console.log("Found script UTxO at index:", giftCardUtxo.input.outputIndex);

    const inlineDatum = deserializeDatum<List>(
        giftCardUtxo.output.plutusData!,
    ).list;


    const paramTxHash = (inlineDatum[0] as BuiltinByteString).bytes;
    const paramTxId = (inlineDatum[1] as Integer).int as number;
    const tokenNameHex = (inlineDatum[2] as BuiltinByteString).bytes;
    console.log(paramTxHash);
    console.log(paramTxId);

    const giftCardScript = applyParamsToScript(
        readValidator("gift_card.gift_card.mint"),
        [
            builtinByteString(tokenNameHex),
            outputReference(paramTxHash, paramTxId)
        ],
        "JSON"
    );


    const giftCardPolicy = resolveScriptHash(giftCardScript, "V3");


    const redeemScript = applyParamsToScript(
        readValidator("gift_card.redeem.spend"),
        [tokenNameHex, giftCardPolicy]
    );

    const txBuilder = getTxBuilder();

    await txBuilder

        .spendingPlutusScript("V3")
        .txIn(
            giftCardUtxo.input.txHash,
            giftCardUtxo.input.outputIndex,
            giftCardUtxo.output.amount,
            giftCardUtxo.output.address,
        )
        .spendingReferenceTxInInlineDatumPresent()
        .spendingReferenceTxInRedeemerValue("")
        .txInScript(redeemScript)

        .mintPlutusScript("V3")
        .mint("-1", giftCardPolicy, tokenNameHex)
        .mintingScript(giftCardScript)
        .mintRedeemerValue(mConStr1([]))
        .changeAddress(walletAddress)
        .txInCollateral(
            collateral.input.txHash,
            collateral.input.outputIndex,
            collateral.output.amount,
            collateral.output.address,
        )
        .selectUtxosFrom(utxos)
        .complete();

    const signedTx = await wallet.signTx(txBuilder.txHex);
    const submitTx = await wallet.submitTx(signedTx);
    console.log("Burn transaction hash:", submitTx);
}

main();