import { SignMessage, ActionType, KeyType } from "up-aggregator-utils";
import { k1PersonalSign, getRSAFromPem } from "../utils/crypto.js";
import { getFileData } from "../utils/file.js";
import { delLocalKeyTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

async function getTxData() {
  const nonce = "0x3";
  const account = getFileData("./mock/account.json", true);
  const rsaKey = getFileData("./mock/addRSAKey.json", true);

  const inner = {
    chainId: process.env.CHAIN_ID,
    action: ActionType.DEL_LOCAL_KEY,
    username: account.tempTxData.username,
    registerEmail: account.tempTxData.email,
    pubKey: rsaKey.publicKey,
    keyType: KeyType.RSA,
    nonce,
  };
  const data = new SignMessage(inner);
  const messageHash = await data.messageHash();
  const sig = k1PersonalSign(messageHash, account.k1.privateKey);
  const { publicKey } = await getRSAFromPem(rsaKey.privatePem);

  const tempTxData = {
    email: account.tempTxData.email,
    username: account.tempTxData.username,
    oriUsername: account.tempTxData.oriUsername,
    oriEmail: account.tempTxData.oriEmail,
    nonce,
    delKeyType: KeyType.RSA,
    delKey: publicKey,
    keyType: KeyType.Secp256K1,
    key: account.k1.publicKey,
    sig,
  };
  return { tempTxData, k1: account.k1 };
}

async function getDelLocalKeyTxData() {
  const initData = await getTxData();
  const tx = await delLocalKeyTx(initData.tempTxData, initData.k1.publicKey);
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

const data = await getDelLocalKeyTxData();
console.log(data);
