const { ethers } = require("ethers");
const mongoose = require("mongoose");

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

mongoose
  .connect(
    "mongodb+srv://doadmin:T90z356s1FL7wK4g@db-mongodb-nyc1-03894-f1901bee.mongo.ondigitalocean.com/tradingdb?tls=true&authSource=admin&replicaSet=db-mongodb-nyc1-03894",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected!"))
  .catch((err) => {
    console.log("Connected Faild!" + err);
  });

const USERWALLETSchema = mongoose.Schema({
  UID: String,
  DEPOSIT: String,
  Amount: Number,
  hash: String,
  status: String,
  timestamp: Date,
});

const USERWALLETMODEL = mongoose.model("USERWALLETMODEL", USERWALLETSchema);

const WSSProvider = [
  new ethers.providers.WebSocketProvider(
    "wss://ws-nd-173-809-243.p2pify.com/c1a289c068810373cfbb3fa2595d2373"
  ),
];

WSSProvider.map((Provider) => {
  console.log("Sync Start");
  Provider.on("pending", async (txHash) => {
    const tx = await Provider.getTransaction(txHash);
    if (tx === null) return;

    await handelDeposit({
      deposit_address: tx.to,
      Amount: ethers.utils.formatEther(tx.value),
      txhash: tx.hash,
      blockNumber: tx.blockNumber,
      type: "erc20",
      status: tx.confirmations,
      network: (await Provider.getNetwork()).name,
      chain_id: (await Provider.getNetwork()).chainId,
    });
  });

  const handelDeposit = async (DATA) => {
    const pravet =
      "cd8a660a12da1135dd6cf1ce00eb3e9e3d74fa51a88de5005611d13b4fb486ca";
    const Wallet = new ethers.Wallet(pravet, Provider);

    if (DATA.deposit_address === (await Wallet.getAddress())) {
      console.log(`NEW DEPOSIT ${DATA.deposit_address} =>  ${DATA.Amount} `);

      const de = {
        UID: Math.random(0, 400),
        DEPOSIT: DATA.deposit_address,
        Amount: DATA.Amount,
        hash: DATA.txhash,
        status: DATA.status,
        timestamp: new Date(),
      };
      await USERWALLETMODEL.create(de);
    }
  };

  const handelDepositerc20 = async (DATA) => {
    console.log(DATA);
  };
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
