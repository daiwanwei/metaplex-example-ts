import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";
import process from "process";
import {getMetadataAccount} from "./metaplex/tokenMetadata";

async function main() {
    //設定devnet
    const connection = new Connection(clusterApiUrl("devnet"), 'confirmed');
    // example 1:利用metadata pubkey取得metadata account資料
    // usecase: https://explorer.solana.com/address/ATYRCCYFwzqncS8TdS18PoSiAQ1KMshvmte3fdds26eJ/metadata?cluster=devnet
    // metadata account:ATxqNhYhMJvSKwHuufYCScu7DJCriNQuSwtj1BdgC5WT
    // mint account: ATYRCCYFwzqncS8TdS18PoSiAQ1KMshvmte3fdds26eJ
    const addr = "45CNe6KbJaNmxCKN5NgA3VP5sHfUmcrknW7V6epzPgf3"
    let metadata=await getMetadataAccount(connection, addr)
    console.log(`metadata account(${addr}):\n
    --mint(${metadata.mint})\n
    --data(name(${metadata.data.name}),symbol(${metadata.data.symbol}),tokenStandard(${metadata.tokenStandard}))`)

    // example 2:利用metadata pubkey取得metadata account資料
    // usecase: https://explorer.solana.com/address/ATYRCCYFwzqncS8TdS18PoSiAQ1KMshvmte3fdds26eJ/metadata?cluster=devnet
    // metadata account:ATxqNhYhMJvSKwHuufYCScu7DJCriNQuSwtj1BdgC5WT
    // mint account: ATYRCCYFwzqncS8TdS18PoSiAQ1KMshvmte3fdds26eJ
    // const mint = "9agU9phL9MfYAQB3UHwivwWtMqNYyZxHgYtSWapVNfrD"
    // metadata=await getMetadataAccountByMint(connection, mint)
    // console.log(`metadata account(${addr}):\n
    // --mint(${metadata.mint})\n
    // --data(name(${metadata.data.name}),symbol(${metadata.data.symbol}))`)

    // example 3:建立一個nft的mint account
    // const filepath="/Users/alien/.config/solana/solmeet-keypair-1.json"; //填入自己的keypair路徑(需在練上有錢)
    // const payer=getKeypairFromFile(filepath);
    // const mint=Keypair.generate();
    // console.log(`payer pubkey:${payer.publicKey}`)
    // await createMintAccountOfNFT(connection,{
    //     payer:payer,
    //     mint:mint,
    //     mintAuthority:payer.publicKey,
    //     freezeAuthority:payer.publicKey,
    // })

    // example 4:建立一個nft的metadata account

    // const filepath="/Users/alien/.config/solana/solmeet-keypair-1.json"; //填入自己的keypair路徑(需在練上有錢)
    // const payer=getKeypairFromFile(filepath);
    // const mint=new PublicKey("EAoWfx9Srcmr3wpcjatoUFoKZJA7uEW3yiQK93YDU8D5")
    // await createMetadataAccountOfNFT(connection,{
    //     mint: mint,
    //     mintAuthority: payer,
    //     payer: payer,
    //     updateAuthority: payer.publicKey,
    //     data: {
    //         name: "daiwanwei",
    //         symbol: "DWW",
    //         uri: "https://github.com/daiwanwei",
    //         sellerFeeBasisPoints: 10,
    //     },
    //     isMutable: true,
    // })
}

main()
    .then(() => console.log(`execute successfully`))
    .catch((e) => console.log(`execute err:${e}`))
    .finally(() => process.exit(0))
