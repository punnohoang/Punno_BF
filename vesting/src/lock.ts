import {
    Asset,
    deserializeAddress,
    mConStr0,
    MeshTxBuilder,
    MeshValue,
    Transaction,
} from "@meshsdk/core";
import {
    getScript,
    getTxBuilder,
    wallet,
    blockchainProvider,
    getWalletInfoForTx,
} from "./common";
async function main() {
    const { utxos, walletAddress, collateral } = await getWalletInfoForTx(wallet);
    console.log("Collateral : " + collateral);
    console.log("utxos : " + utxos);
    const assets: Asset[] = [
        {
            unit: "lovelace",
            quantity: "30000000",
        },

    ];

    const { scriptAddr, scriptCbor } = getScript();
    const value = MeshValue.fromAssets(assets);
    console.log(value);
    const meshTxBuilder = new MeshTxBuilder({
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
    });
    const txBuilder = new MeshTxBuilder({
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
    });


    const lockUntilTimeStamp = new Date().getTime() + 1 * 60 * 1000;


    const beneficiary =
        "addr_test1qqwkave5e46pelgysvg6mx0st5zhte7gn79srscs8wv2qp5qkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqyqqef6";

    const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(walletAddress);
    const { pubKeyHash: beneficiaryPubKeyHash } = deserializeAddress(beneficiary);


    await txBuilder
        .txOut(scriptAddr, assets)
        .txOutInlineDatumValue(
            mConStr0([ownerPubKeyHash, beneficiaryPubKeyHash, lockUntilTimeStamp])
        )
        .changeAddress(walletAddress)

        .selectUtxosFrom(utxos)
        .complete();

    const unsignedTx = txBuilder.txHex;
    //  const tx = new Transaction({initiator: wallet});


    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
    console.log("txhash: " + txHash);
    console.log("Khoa");
}
main();