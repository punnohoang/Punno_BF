import fs from "node:fs";
import {
    BlockfrostProvider,
    MeshTxBuilder,
    MeshWallet,
    serializePlutusScript,
    UTxO,
} from "@meshsdk/core";
import { applyParamsToScript } from "@meshsdk/core-csl";
import blueprint from "../plutus.json";

const blockchainProvider = new BlockfrostProvider('preprodoH7AR2NnafvX3rxjqWO8GAJ0CVxqT02s');

// wallet for signing transactions
export const wallet = new MeshWallet({
    networkId: 0, // Mạng Cardano: 0 là Testnet (Preview)
    fetcher: blockchainProvider, // Provider để truy vấn blockchain
    submitter: blockchainProvider, // Provider để gửi giao dịch
    key: {
        type: 'mnemonic', // loai 24 ki tu
        // words: [
        //     "mean", "regret", "amused", "fog", "poverty",
        //     "night", "island", "reflect", "timber", "palm", "planet",
        //     "sample", "bullet", "game", "peace", "host",
        //     "margin", "angry", "pumpkin", "reason", "tribe",
        //     "rebuild", "wedding", "erupt"
        // ], // Danh sách các từ mnemonic
        words: [
            "crumble", "patient", "strike", "circle", "venture",
            "profit", "cycle", "feature", "auction", "ring", "double",
            "trim", "renew", "steel", "alcohol", "picnic",
            "token", "skirt", "fall", "second", "stage",
            "rely", "audit", "dice"
        ],
    },
});

export function getScript() {
    const scriptCbor = applyParamsToScript(
        blueprint.validators[0].compiledCode,
        []
    );

    const scriptAddr = serializePlutusScript(
        { code: scriptCbor, version: "V3" },
    ).address;

    return { scriptCbor, scriptAddr };
}

// reusable function to get a transaction builder
export function getTxBuilder() {
    return new MeshTxBuilder({
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
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