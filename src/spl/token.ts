import {Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Signer, SystemProgram, Transaction} from "@solana/web3.js";
import {
    MintLayout,
    TOKEN_PROGRAM_ID,
    //@ts-ignore
    getMinimumBalanceForRentExemptMint,
    //@ts-ignore
    createInitializeMintInstruction,
    //@ts-ignore
    createSyncNativeInstruction,
    //@ts-ignore
    getAssociatedTokenAddress,
    //@ts-ignore
    createAssociatedTokenAccountInstruction,
    //@ts-ignore
    createMintToInstruction,mintTo
} from "@solana/spl-token";


export async function convertToWSOL(connection: Connection, args: ConvertToWSOLArgs){
    const {from,to,amount} =args;
    const tx = new Transaction()
        .add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: amount,
            }),
            createSyncNativeInstruction(
                to
            )
        )
    const hash= await connection.sendTransaction(tx, [from]);
    console.log(`convertToWSOL:\n
    transaction hash(${hash})\n`)
}

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


export async function createATA(connection: Connection, args: CreateATAArgs):Promise<PublicKey> {
    const {mint,owner,payer}=args
    const ata = await getAssociatedTokenAddress(
        mint,
        owner
    )

    const tx = new Transaction()
        .add(
            createAssociatedTokenAccountInstruction(
                payer.publicKey,
                ata,
                owner,
                mint
            )
        );
    const hash=await connection.sendTransaction(tx, [payer]);
    console.log(`create ata:\n
    transaction hash(${hash})\n
    ata(${ata.toBase58()})\n`)
    return ata;
}

export async function mintToAccount(connection: Connection, args: MintToAccountArgs) {
    const {payer,mint, to, authority, amount}=args
    const hash=await mintTo(connection,payer,mint,to,authority,amount)
    // const tx = new Transaction()
    //     .add(
    //         createMintToInstruction(
    //             mint,to,authority.publicKey,amount
    //         )
    //     );
    // const hash=await connection.sendTransaction(tx, [authority]);
    console.log(`create ata:\n
    transaction hash(${hash})\n`)
}

interface CreateTokenArgs {
    payer: Keypair,
    mint: Keypair,
    mintAuthority: PublicKey,
    freezeAuthority:PublicKey,
}

interface ConvertToWSOLArgs {
    from: Keypair,
    to: PublicKey,
    amount: number,
}

interface CreateATAArgs {
    payer:Keypair,
    owner: PublicKey,
    mint: PublicKey,
}

interface MintToAccountArgs {
    payer:Keypair,
    mint: PublicKey,
    to: PublicKey,
    authority: Keypair | PublicKey ,
    amount: number | bigint,
}
