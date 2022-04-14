import {Connection} from "@solana/web3.js";
import {getMetadataAccount} from "../../src/metaplex/tokenMetadata";

describe("token metadata test", () => {
    let connection: Connection;
    beforeEach(() => {
        const rpcUri = 'https://ssc-dao.genesysgo.net/';
        connection = new Connection(rpcUri, 'confirmed');
    })
    it("get metadata account", async () => {
        const address = "2WV5oc2zTftfkyP7tf3DJvDMJCRrmpNbFcEgr7nfRhWF"
        const metadata = await getMetadataAccount(connection, address)
        console.log(`metadata account(${address}):\n 
            --mint(${metadata.mint})\n
            --data(name(${metadata.data.name}),symbol(${metadata.data.symbol}))`)
    });
})
