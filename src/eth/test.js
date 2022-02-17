import Web3 from "@rangersprotocolweb3/web3";
import { getFileData } from "../unipass/utils/file.js";

const web3 = new Web3(
  "wss://robin.rangersprotocol.com/pubhub/api/reader",
  "wss://robin.rangersprotocol.com/pubhub/api/writer",
  "wss://robin-sub.rangersprotocol.com"
);
const myAddress = getFileData("./src/unipass/mock/ethKey.json", true);
console.log(myAddress);

const nonce = await web3.eth.getTransactionCount(myAddress.publicKey, "latest"); // nonce starts counting from 0
const transaction = {
  to: "0xBAAF7Bc749Bba6867F28B30CDec99c0160a6Fc22", // faucet address to return eth
  value: 0.01,
  gas: 21000,
  maxFeePerGas: 21000,
  nonce: Number(nonce),
  // optional data field to send message or execute smart contract
};
const signedTx = await web3.eth.accounts.signTransaction(
  transaction,
  myAddress.privateKey
);
console.log(signedTx);

const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
console.log(tx);

web3.eth.accounts
  .signTransaction(
    {
      nonce: Number(nonce), // Use the right nonce here, just hardcoding at 1 for the example.
      from: myAddress.publicKey,
      to: "0xBAAF7Bc749Bba6867F28B30CDec99c0160a6Fc22",
      value: 0.1,
      gas: 21000,
      maxFeePerGas: 21000,
    },
    myAddress.privateKey
  )
  .then((tx) => {
    var rawTx = tx.rawTransaction;
    console.log(tx);
    web3.eth
      .sendSignedTransaction(rawTx)
      .on("receipt", console.log)
      .on("transactionHash", function (hash) {
        console.log("transactionHash");
        console.log({ hash });
      })
      .on("receipt", function (receipt) {
        console.log("receipt");
        console.log({ receipt });
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log("confirmation");
        console.log({ confirmationNumber, receipt });
      })
      .on("error", function (error, receipt) {
        console.log("error");
        console.log({ error, receipt });
      });
  });
