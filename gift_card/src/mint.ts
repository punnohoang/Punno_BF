import {
    builtinByteString,
    mConStr0,
    outputReference,
    PlutusScript,
    stringToHex,
} from "@meshsdk/common";
import {
    Asset,
    resolveScriptHash,
    serializePlutusScript,
} from "@meshsdk/core";
import { applyParamsToScript } from "@meshsdk/core-cst";
import { readValidator, wallet, getWalletInfoForTx, getTxBuilder } from "./common";

async function main() {
    const tokenName = "Longdzvcl";
    const tokenNameHex = stringToHex(tokenName);
    const { utxos, walletAddress, collateral } = await getWalletInfoForTx(wallet);

    const utxo = utxos[0];
    if (utxo === undefined) throw new Error("No UTXOs available");
    const remainingUtxos = utxos.slice(1);

    const giftValue: Asset[] = [
        {
            unit: "lovelace",
            quantity: "10000000",
        },
    ];
    const minscriptCbor = applyParamsToScript(
        readValidator("gift_card.gift_card.mint"),
        [
            builtinByteString(tokenNameHex),
            outputReference(utxo.input.txHash, utxo.input.outputIndex)
        ],
        "JSON"
    );

    const mintPolicy = resolveScriptHash(minscriptCbor, "V3");
    const redeemCbor = applyParamsToScript(
        readValidator("gift_card.redeem.spend"),
        [tokenNameHex, mintPolicy]
    );

    const redeemScriptAddr = serializePlutusScript({ code: redeemCbor, version: "V3" }).address;
    const txBuilder = getTxBuilder();
    await txBuilder
        .txIn(
            utxo.input.txHash,
            utxo.input.outputIndex,
            utxo.output.amount,
            utxo.output.address,
        )
        .mintPlutusScript("V3")
        .mint("1", mintPolicy, tokenNameHex)
        .mintingScript(minscriptCbor)
        .mintRedeemerValue(mConStr0([]))
        .txOut(walletAddress, [
            { unit: mintPolicy + tokenNameHex, quantity: "1" },
        ])
        .txOut(redeemScriptAddr, [...giftValue])
        .txOutInlineDatumValue([
            utxo.input.txHash,
            utxo.input.outputIndex,
            tokenNameHex,
        ])
        .changeAddress(walletAddress)
        .txInCollateral(
            collateral.input.txHash,
            collateral.input.outputIndex,
            collateral.output.amount,
            collateral.output.address,
        )
        .selectUtxosFrom(remainingUtxos)
        .complete();

    const signedTx = await wallet.signTx(txBuilder.txHex);
    const submitTx = await wallet.submitTx(signedTx);
    console.log("Transaction hash:", submitTx);
}

main();