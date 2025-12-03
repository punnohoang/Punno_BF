import {
    Asset,
    deserializeAddress,
    deserializeDatum,
    mConStr0,
    mConStr1,
    MeshTxBuilder,
    MeshValue,
    pubKeyAddress,
    pubKeyHash,
    signData,
    SLOT_CONFIG_NETWORK,
    unixTimeToEnclosingSlot,
    UTxO,
    Transaction,
    slotToBeginUnixTime
} from "@meshsdk/core";
import {
    blockchainProvider,
    getScript,
    getTxBuilder,
    getUtxoByTxHash,
    getWalletInfoForTx,
    wallet,
} from "./common";

async function main() {
    try {


        const txHash =
            "3dac1c48c981587bf8353a11d7b6bf338a8b920c908e681c349223fbb39bd40c";
        //process.argv[2];
        const contractutxos = await blockchainProvider.fetchUTxOs(txHash);
        //console.log("Contract UTXOs:", contractutxos);

        if (!contractutxos || contractutxos.length === 0) {
            throw new Error("No UTXOs found for the given transaction hash.");
        }

        // Tìm UTXO hợp lệ
        const vestingUtxo = contractutxos[0];


        const { utxos, walletAddress, collateral } = await getWalletInfoForTx(wallet);
        const { input: collateralInput, output: collateralOutput } = collateral;


        const { scriptAddr, scriptCbor } = getScript();
        const { pubKeyHash } = deserializeAddress(walletAddress);

        const datum = deserializeDatum(vestingUtxo.output.plutusData!);
        // console.log("Datum:", datum);
        //const pubkeyCurrent = datum.fields[2].bytes;
        const invalidBefore1 =
            unixTimeToEnclosingSlot(Math.min(
                Number(datum.fields[2].int), Date.now() - 15000),
                SLOT_CONFIG_NETWORK.preprod,
            ) + 1;

        const txBuilder = new MeshTxBuilder({
            fetcher: blockchainProvider,
            submitter: blockchainProvider,
        });
        await txBuilder
            .spendingPlutusScriptV3()
            .txIn(
                vestingUtxo.input.txHash,
                vestingUtxo.input.outputIndex,
                vestingUtxo.output.amount,
                scriptAddr
            )
            .spendingReferenceTxInInlineDatumPresent()

            .spendingReferenceTxInRedeemerValue("")
            .txInScript(scriptCbor)
            .txOut(walletAddress, [])
            .txInCollateral(
                collateralInput.txHash,
                collateralInput.outputIndex,
                collateralOutput.amount,
                collateralOutput.address
            )

            .invalidBefore(invalidBefore1)
            .requiredSignerHash(pubKeyHash)
            .changeAddress(walletAddress)
            .selectUtxosFrom(utxos)
            .setNetwork("preprod")
            .complete();

        console.log("Transaction built successfully.");

        const unsignedTx = txBuilder.txHex;
        console.log("Unsigned Transaction:", unsignedTx);

        const signedTx = await wallet.signTx(unsignedTx, true);
        console.log("Signed Transaction:", signedTx);

        const txhash = await wallet.submitTx(signedTx);
        console.log("Transaction Hash:", txhash);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main().catch(error => {
    console.error("Unhandled error:", error);
});






