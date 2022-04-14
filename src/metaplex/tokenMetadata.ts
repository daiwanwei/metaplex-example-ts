import {
    Connection, Keypair, PublicKey, Transaction
} from '@solana/web3.js'
import {
    Metadata, PROGRAM_ID, createCreateMetadataAccountV2Instruction
} from "@metaplex-foundation/mpl-token-metadata";


export async function getMetadataAccount(connection: Connection, address: string): Promise<Metadata> {
    const pubkey = new PublicKey(address)
    const metadata = await Metadata.fromAccountAddress(connection, pubkey)
    return metadata
}

export async function getMetadataAccountByMint(connection: Connection, mint: string): Promise<Metadata> {
    const [pubkey, bump] = await PublicKey.findProgramAddress(
        [
            Buffer.from('metadata'),
            PROGRAM_ID.toBuffer(),
            new PublicKey(mint).toBuffer(),
        ], PROGRAM_ID)
    const metadata = await Metadata.fromAccountAddress(connection, pubkey)
    return metadata
}

export async function createMetadataAccountOfNFT(connection: Connection, args: CreateMetadataAccountArgs) {
    const {
        mint, mintAuthority, payer, updateAuthority,
        data, isMutable
    } = args;
    const {name, symbol, uri, sellerFeeBasisPoints} = data;

    // 因為是PDA,所以藉由findProgramAddress取得metadata account的pubkey
    const [metadata, bump] = await PublicKey.findProgramAddress(
        [
            Buffer.from('metadata'),
            PROGRAM_ID.toBuffer(),
            new PublicKey(mint).toBuffer(),
        ], PROGRAM_ID)
    //建立ix
    const tx = new Transaction()
        .add(
            //產生ix
            createCreateMetadataAccountV2Instruction({
                metadata, mint,
                mintAuthority: mintAuthority.publicKey,
                payer: payer.publicKey,
                updateAuthority
            }, {
                createMetadataAccountArgsV2: {
                    isMutable,
                    data: {
                        name,
                        symbol,
                        uri,
                        sellerFeeBasisPoints,
                        creators: null,
                        collection:null,
                        uses:null,
                    }
                }
            })
        )
    //signers是在這筆tx中需要簽名的account
    const signers = [mintAuthority, payer]
    //送出tx
    const hash = await connection.sendTransaction(tx, signers)
    console.log(`create metadata account of NFT:\n
    transaction hash(${hash})\n
    metadata(${metadata.toBase58()})\n
    mint(${mint.toBase58()})\n
    data(name:${name},symbol:${symbol})`)
}

interface CreateMetadataAccountArgs {
    //account for instruction
    mint: PublicKey;
    mintAuthority: Keypair;
    payer: Keypair;
    updateAuthority: PublicKey;


    //args for instruction
    data: Data;
    isMutable: boolean;
}

interface Data {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    // creators: Creator[] | null;
    // collection: Collection | null;
    // uses: Uses | null;
}

interface Creator {
    address: PublicKey;
    verified: boolean;
    share: number;
}

interface Collection {
    verified: boolean;
    key: PublicKey;
};

// interface Uses {
//     useMethod: UseMethod;
//     remaining: beet.bignum;
//     total: beet.bignum;
// };
