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
        to: ['0xac0735f7f9c7b6b4a8ad837c43952f3d44143776']
      },
      {
        from: ['0xac0735f7f9c7b6b4a8ad837c43952f3d44143776']
      }
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

  const receiver = await client.stream(query, { reverse: false });

  console.log(res);
  while (true) {
    let res = await receiver.recv();
    if (res === null) {
      console.log("No data to receive, waiting for more data...");
      await new Promise(resolve => setTimeout(resolve, 5000));
      continue;
    }
    for (const tx of res.data.transactions) {
      console.log(tx);
    }
  }
}

main();
