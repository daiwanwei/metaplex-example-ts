import {Connection, Keypair, PublicKey, Transaction} from "@solana/web3.js";
import {AuctionHouseProgram} from "@metaplex-foundation/mpl-auction-house";
import web3 from "@solana/web3.js";
import * as beet from "@metaplex-foundation/beet";
import {Metadata, PROGRAM_ID} from "@metaplex-foundation/mpl-token-metadata";

export async function createAuctionHouse(connection: Connection,args:CreateAuctionHouseArgs) {
    const {
        treasuryMint,
        payer,
        authority,
        feeWithdrawalDestination,
        treasuryWithdrawalDestination,
        treasuryWithdrawalDestinationOwner,
    } = args;
    console.log(`treasuryMint ${treasuryMint.toBase58()}\n
    payer ${payer.publicKey.toBase58()}\n
    authority ${authority.toBase58()}\n
    feeWithdrawalDestination ${feeWithdrawalDestination.toBase58()}\n
    treasuryWithdrawalDestination ${treasuryWithdrawalDestination.toBase58()}\n
    treasuryWithdrawalDestinationOwner ${treasuryWithdrawalDestinationOwner.toBase58()}\n
    `)

    const [auctionHouse,auctionHouseBump]=await AuctionHouseProgram.findAuctionHouseAddress(authority,treasuryMint)
    const [auctionHouseFeeAccount,auctionHouseFeeAccountBump]=await AuctionHouseProgram.findAuctionHouseFeeAddress(auctionHouse)
    const [auctionHouseTreasury,auctionHouseTreasuryBump]=await AuctionHouseProgram.findAuctionHouseTreasuryAddress(auctionHouse)
    //建立ix
    const tx = new Transaction()
        .add(
            //產生ix
            AuctionHouseProgram.instructions.createCreateAuctionHouseInstruction({
                treasuryMint,
                payer:payer.publicKey,
                authority,
                feeWithdrawalDestination,
                treasuryWithdrawalDestination,
                treasuryWithdrawalDestinationOwner,
                auctionHouse,
                auctionHouseFeeAccount,
                auctionHouseTreasury,
            }, {
                bump:auctionHouseBump,
                feePayerBump:auctionHouseFeeAccountBump,
                treasuryBump:auctionHouseTreasuryBump,
                sellerFeeBasisPoints:0,
                requiresSignOff:false,
                canChangeSalePrice:false,
            })
        )
    //signers是在這筆tx中需要簽名的account
    const signers = [payer]
    //送出tx
    const hash = await connection.sendTransaction(tx, signers)
    console.log(`create metadata account of NFT:\n
    transaction hash(${hash})\n
    auctionHouse(${auctionHouse.toBase58()})\n
    auctionHouseFeeAccount(${auctionHouseFeeAccount.toBase58()})\n
    auctionHouseTreasury(${auctionHouseTreasury.toBase58()})\n
    `)
}

export async function sell(connection: Connection,args:SellArgs) {
    const {
        wallet,
        mint,
        tokenAccount,
        auctionHouse,

        buyerPrice,
        tokenSize,
    } = args;
    const [metadata, _] = await PublicKey.findProgramAddress(
        [
            Buffer.from('metadata'),
            PROGRAM_ID.toBuffer(),
            new PublicKey(mint).toBuffer(),
        ], PROGRAM_ID)
    const auctionHouseInfo=await AuctionHouseProgram.accounts.AuctionHouse.fromAccountAddress(connection,auctionHouse);
    const [sellerTradeState,tradeStateBump]=await AuctionHouseProgram.findTradeStateAddress(
        auctionHouseInfo.authority,auctionHouse,tokenAccount,auctionHouseInfo.treasuryMint,mint,buyerPrice,tokenSize
    )
    const [freeSellerTradeState,freeTradeStateBump]=await AuctionHouseProgram.findTradeStateAddress(
        auctionHouseInfo.authority,auctionHouse,tokenAccount,auctionHouseInfo.treasuryMint,mint,0,tokenSize
    )
    const [programAsSigner,programAsSignerBump]=await AuctionHouseProgram.findAuctionHouseProgramAsSignerAddress()
    //建立ix
    const tx = new Transaction()
        .add(
            //產生ix
            AuctionHouseProgram.instructions.createSellInstruction({
                wallet:wallet.publicKey,
                tokenAccount,
                metadata,
                authority:auctionHouseInfo.authority,
                auctionHouse,
                auctionHouseFeeAccount:auctionHouseInfo.auctionHouseFeeAccount,
                sellerTradeState,
                freeSellerTradeState,
                programAsSigner,
            }, {
                tradeStateBump,
                freeTradeStateBump,
                programAsSignerBump,
                buyerPrice,
                tokenSize,
            })
        )
    //signers是在這筆tx中需要簽名的account
    const signers:Keypair[] = []
    //送出tx
    const hash = await connection.sendTransaction(tx, signers)
    console.log(`create metadata account of NFT:\n
    transaction hash(${hash})\n
    auctionHouse(${auctionHouse.toBase58()})\n
    sellerTradeState(${sellerTradeState.toBase58()})\n
    freeSellerTradeState(${freeSellerTradeState.toBase58()})\n
    programAsSigner(${programAsSigner.toBase58()})\n
    `)
}

interface CreateAuctionHouseArgs {
    //account for instruction
    treasuryMint: PublicKey;
    payer: Keypair;
    authority: PublicKey;
    feeWithdrawalDestination: PublicKey;
    treasuryWithdrawalDestination: PublicKey;
    treasuryWithdrawalDestinationOwner: PublicKey;
}

interface SellArgs {
    //account for instruction
    wallet: Keypair,
    mint:PublicKey,
    tokenAccount: PublicKey,
    auctionHouse: PublicKey,

    //args for instruction
    buyerPrice: beet.bignum,
    tokenSize: beet.bignum,
}
