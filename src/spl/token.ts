import {Connection, Keypair, PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
import {
    MintLayout,
    TOKEN_PROGRAM_ID,
    getMinimumBalanceForRentExemptMint,
    createInitializeMintInstruction
} from "@solana/spl-token";

export async function createMintAccountOfNFT(connection: Connection, args: CreateTokenArgs) {
    let {payer, mint, mintAuthority,freezeAuthority} = args
    let tx = new Transaction()
        .add(
            SystemProgram.createAccount({
                fromPubkey: payer.publicKey,
                newAccountPubkey: mint.publicKey,
                space: MintLayout.span,
                lamports: await getMinimumBalanceForRentExemptMint(connection),
                programId: TOKEN_PROGRAM_ID,
            })
        ).add(
            createInitializeMintInstruction(mint.publicKey,0,mintAuthority,freezeAuthority)
        )
    //signers是在這筆tx中需要簽名的account
    const signers=[payer,mint]
    //送出tx
    const hash=await connection.sendTransaction(tx,signers)
    console.log(`create mint account of NFT:\n
    transaction hash(${hash})\n
    mint(${mint.publicKey.toBase58()})\n`)
}

interface CreateTokenArgs {
    payer: Keypair,
    mint: Keypair,
    mintAuthority: PublicKey,
    freezeAuthority:PublicKey,
}
