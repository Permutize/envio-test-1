import 'dotenv/config';
import { HypersyncClient, Decoder, TransactionField, Query } from "@envio-dev/hypersync-client";

async function main() {
  // Create hypersync client using the mainnet hypersync endpoint
  const client = HypersyncClient.new({
    url: process.env.HYPERSYNC_URL,
  });

  // The query to run
  const query: Query = {
    "fromBlock": 0,
    "transactions": [
      // get all transactions coming from and going to our address.
      {
        contractAddress: ["0xd5b9C4e1f604CB547E5f080A131Be01858D9B399"], 
      },
    ],
    "fieldSelection": {
      "transaction": [
        TransactionField.BlockNumber,
        TransactionField.Hash,
        TransactionField.From,
        TransactionField.To,
        TransactionField.Value,
      ]
    }
  };

  // Stream data in reverse order
  //
  // This will parallelize internal requests so we don't have to worry about pipelining/parallelizing make request -> handle response -> handle data loop
  const res = await client.get(query);
  console.log(res);
}

main();
