import {clusterApiUrl, Connection, Keypair, PublicKey} from "@solana/web3.js";
import process from "process";
import {createMetadataAccountOfNFT, getMetadataAccount} from "./metaplex/tokenMetadata";
import {getKeypairFromFile} from "./utils";
import {convertToWSOL, createATA, createMintAccountOfNFT, mintToAccount} from "./spl/token";
import {NATIVE_MINT} from "@solana/spl-token";
import {createAuctionHouse, sell} from "./metaplex/auctionHouse";
import * as beet from "@metaplex-foundation/beet";

async function main() {
    //設定devnet
    const connection = new Connection(clusterApiUrl("devnet"), 'confirmed');


    // 開始前先建立一個nft
    // const sellerFilepath="./seller.json";
    // const mintFilepath="./mycoin.json";
    // const seller=getKeypairFromFile(sellerFilepath);
    // const mint=getKeypairFromFile(mintFilepath);
    //step1:建立nft mint
    // await createMintAccountOfNFT(connection,{
    //     payer:seller,
    //     mint:mint,
    //     mintAuthority:seller.publicKey,
    //     freezeAuthority:seller.publicKey,
    // })
    //step2:建立nft metadata
    // await createMetadataAccountOfNFT(connection,{
    //     mint: mint.publicKey,
    //     mintAuthority: seller,
    //     payer: seller,
    //     updateAuthority: seller.publicKey,
    //     data: {
    //         name: "daiwanwei",
    //         symbol: "DWW",
    //         uri: "https://github.com/daiwanwei",
    //         sellerFeeBasisPoints: 10,
    //     },
    //     isMutable: true,
    // })
    //step3:建立ata 接收nft
    // const ata=await createATA(connection,{
    //     payer:seller,
    //     owner:seller.publicKey,
    //     mint:mint.publicKey,
    // })
    //step4:mint nft到ata
    // const ata=new PublicKey("9q8o6uasAA8vsYVNJcuEZmavZ7S4MAQYVbtMR7dcF4z9")
    // await mintToAccount(connection,{
    //     payer:seller,
    //     mint: mint.publicKey,
    //     authority: seller,
    //     to: ata,
    //     amount: 10,
    // })

    //example 1: step1 建立一個拍賣會
    // const filepath="./seller.json";
    // const seller=getKeypairFromFile(filepath);
    // console.log(seller.publicKey.toBase58())
    // await createAuctionHouse(connection,{
    //     treasuryMint: NATIVE_MINT,
    //     payer: seller,
    //     authority: seller.publicKey,
    //     feeWithdrawalDestination: seller.publicKey,
    //     treasuryWithdrawalDestination: seller.publicKey,
    //     treasuryWithdrawalDestinationOwner: seller.publicKey,
    // })

    //example 1: step2 將nft上架
    const filepath="./seller.json";
    const mintFilepath="./mycoin.json";
    const seller=getKeypairFromFile(filepath);
    const mint=getKeypairFromFile(mintFilepath);
    const ata=new PublicKey("9q8o6uasAA8vsYVNJcuEZmavZ7S4MAQYVbtMR7dcF4z9")
    const auctionHouse=new PublicKey("8anVNx9VeNtD5AZKLy6ieyNcXfUAvDSKMMong3QawxJp")
    console.log(seller.publicKey.toBase58())
    await sell(connection,{
        wallet: seller,
        mint:mint.publicKey,
        tokenAccount: ata,
        auctionHouse: auctionHouse,
        buyerPrice: 10,
        tokenSize: 1,
    })

    // example 2:買家購買商品
    // const filepath="./buyer.json";
    // const buyer=getKeypairFromFile(filepath);
    // console.log(`payer pubkey:${buyer.publicKey}`)
    // await createATA(connection,{
    //     payer:buyer,
    //     owner:buyer.publicKey,
    //     mint:NATIVE_MINT,
    // })
    // const filepath="./buyer.json";
    // const buyer=getKeypairFromFile(filepath);
    // const to=new PublicKey("EfRb7C6Qd1TFetauoND7KwRGiuAacCni6xJjoZAbrjkV")
    // await convertToWSOL(connection,{
    //     from:buyer,
    //     to:to,
    //     amount:1000000000,
    // })

}

main()
    .then(() => console.log(`execute successfully`))
    .catch((e) => console.log(`execute err:${e}`))
    .finally(() => process.exit(0))
