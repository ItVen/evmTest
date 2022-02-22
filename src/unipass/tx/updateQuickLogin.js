import { SignMessage, ActionType, KeyType } from "up-aggregator-utils";
import { k1PersonalSign } from "../utils/crypto.js";
import { getFileData } from "../utils/file.js";
import { updateQuickLoginTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

const argsUsername = process.argv.splice(2);
const fileName = argsUsername[0];
const nonce = argsUsername[1];
let quickLogin = argsUsername[2];
quickLogin = quickLogin == "true" ? true : false;

async function getData() {
  const account = getFileData(`./mock/${fileName}.json`, true);
  console.log(account);

  const inner = {
    chainId: 0,
    action: ActionType.UPDATE_QUICK_LOGIN,
    username: account.tempTxData.username,
    registerEmail: account.tempTxData.email,
    pubKey: account.k1.publicKey,
    keyType: KeyType.Secp256K1,
    quickLogin,
    nonce,
  };
  const data = new SignMessage(inner);
  const messageHash = await data.messageHash();
  const sig = k1PersonalSign(messageHash, account.k1.privateKey);

  const tempTxData = {
    email: account.tempTxData.email,
    username: account.tempTxData.username,
    oriUsername: account.tempTxData.oriUsername,
    oriEmail: account.tempTxData.oriEmail,
    key: account.k1.publicKey,
    keyType: KeyType.Secp256K1,
    nonce,
    quickLogin,
    sig,
  };
  return { tempTxData, k1: account.k1 };
}

async function updateQuickLogin() {
  const initData = await getData();
  const tx = await updateQuickLoginTx(
    initData.tempTxData,
    initData.k1.publicKey
  );
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

const data = await updateQuickLogin();
console.log(data);
