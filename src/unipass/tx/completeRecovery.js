import { getFileData } from "../utils/file.js";
import { completeRecoveryTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

const argsUsername = process.argv.splice(2);
const fileName = argsUsername[0];
const nonce = argsUsername[1];

async function getData() {
  const account = getFileData(`./mock/${fileName}.json`, true);

  const tempTxData = {
    email: account.tempTxData.email,
    username: account.tempTxData.username,
    oriUsername: account.tempTxData.oriUsername,
    oriEmail: account.tempTxData.oriEmail,
    nonce,
  };
  return { tempTxData, k1: account.k1 };
}

async function completeRecovery(username) {
  const initData = await getData(username);
  const tx = await completeRecoveryTx(
    initData.tempTxData,
    initData.k1.publicKey
  );
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

const data = await completeRecovery();
