import {
    BlockfrostProvider,
    MeshTxBuilder,
    MeshWallet,
    PlutusScript,
    serializePlutusScript,
    UTxO
    , resolvePlutusScriptAddress,
    BrowserWallet,
} from "@meshsdk/core";
//import { applyParamsToScript } from "@meshsdk/core-csl";
import * as fs from 'fs';
import * as path from 'path';
export const blockchainProvider = new BlockfrostProvider('preprodoH7AR2NnafvX3rxjqWO8GAJ0CVxqT02s');

// wallet for signing transactions
export const wallet = new MeshWallet({
    networkId: 0, // Mạng Cardano: 0 là Testnet (Preview, PreprodPreprod)
    fetcher: blockchainProvider, // Provider để truy vấn blockchain
    submitter: blockchainProvider, // Provider để gửi giao dịch
    key: {
        type: 'mnemonic', // loai 24 ki tu
        words: [
            "crumble", "patient", "strike", "circle", "venture",
            "profit", "cycle", "feature", "auction", "ring", "double",
            "trim", "renew", "steel", "alcohol", "picnic",
            "token", "skirt", "fall", "second", "stage",
            "rely", "audit", "dice"
        ],
    },
});
export function readValidator(title: string): string {
    const plutusPath = path.join(__dirname, 'plutus.json');
    const plutusJson = JSON.parse(fs.readFileSync(plutusPath, 'utf-8'));
    const validator = plutusJson.validators.find((v: any) => v.title === title);
    if (!validator) {
        throw new Error(`${title} validator not found.`);
    }
    return validator.compiledCode;
}


// reusable function to get a transaction builder
export function getTxBuilder() {
    return new MeshTxBuilder({
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
        verbose: true,
    });
}

// reusable function to get a UTxO by transaction hash
export async function getUtxoByTxHash(txHash: string): Promise<UTxO> {
    const utxos = await blockchainProvider.fetchUTxOs(txHash);
    if (utxos.length === 0) {
        throw new Error("UTxO not found");
    }
    return utxos[0];
}



export async function getWalletInfoForTx(wallet: MeshWallet) {
    const walletAddress = (await wallet.getUsedAddresses())[0];
    const utxos = await blockchainProvider.fetchAddressUTxOs(walletAddress);
    const collateral = (await wallet.getCollateral())[0];
    return { utxos, walletAddress, collateral };
}
export async function getUtxoForTx(address: string, txHash: string) {
    const utxos: UTxO[] = await blockchainProvider.fetchAddressUTxOs(address);
    const utxo = utxos.find(function (utxo: UTxO) {
        return utxo.input.txHash === txHash;
    });

    if (!utxo) throw new Error("No UTXOs found in getUtxoForTx method.");
    return utxo;
}

export async function getAddressUTXOAsset(address: string, unit: string) {
    const utxos = await blockchainProvider.fetchAddressUTxOs(address, unit);
    return utxos[utxos.length - 1];
};