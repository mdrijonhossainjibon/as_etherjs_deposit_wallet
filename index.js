const { ethers } = require("ethers");

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
    }
  };

  const handelDepositerc20 = async (DATA) => {
    console.log(DATA);
  };
});
