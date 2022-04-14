import {Keypair} from "@solana/web3.js";
import * as fs from "fs";

export function getKeypairFromFile(filePath: string,): Keypair {
    const secretKeyString = fs.readFileSync(filePath, { encoding: 'utf8' })
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString))
    return Keypair.fromSecretKey(secretKey)
}
