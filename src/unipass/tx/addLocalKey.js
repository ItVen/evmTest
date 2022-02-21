import {
  SignMessage,
  ActionType,
  KeyType,
  RpcActionType,
} from "up-aggregator-utils";
import {
  k1PersonalSign,
  signMessage,
  getRSAData,
  getRSAFromPem,
} from "../utils/crypto.js";
import { getFileData } from "../utils/file.js";
import { addLocalKeyTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

async function getAddLocalKeyTxData() {
  const nonce = "0x2";
  const account = getFileData("./mock/account.json", true);
  const rsaKey = getFileData("./mock/addRSAKey.json", true);

  const inner = {
    chainId: process.env.CHAIN_ID,
    action: ActionType.ADD_LOCAL_KEY,
    username: account.tempTxData.username,
    registerEmail: account.tempTxData.email,
    pubKey: rsaKey.publicKey,
    keyType: KeyType.RSA,
    nonce,
  };
  const data = new SignMessage(inner);
  const messageHash = await data.messageHash();
  const sig = k1PersonalSign(messageHash, account.k1.privateKey);

  const { key } = await getRSAFromPem(rsaKey.privatePem);

  const newKeySign = signMessage(key, messageHash);

  const tempTxData = {
    email: account.tempTxData.email,
    username: account.tempTxData.username,
    oriUsername: account.tempTxData.oriUsername,
    oriEmail: account.tempTxData.oriEmail,
    nonce,
    newKeyType: KeyType.RSA,
    newKey: rsaKey.publicKey,
    newKeySign,
    keyType: KeyType.Secp256K1,
    key: account.k1.publicKey,
    sig,
  };
  return { tempTxData, k1: account.k1 };
}

async function getAddLocalKeyData() {
  const initData = await getAddLocalKeyTxData();
  const tx = await addLocalKeyTx(initData.tempTxData, initData.k1.publicKey);
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

const data = await getAddLocalKeyData();
console.log(data);
