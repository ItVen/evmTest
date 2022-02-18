import {
  SignMessage,
  ActionType,
  KeyType,
  RpcActionType,
} from "up-aggregator-utils";
import {
  getHashData,
  k1PersonalSign,
  emailHash,
  signMessage,
  getRSAData,
  getRSAFromPem,
} from "../utils/crypto.js";
import { getFileData } from "../utils/file.js";
import { addLocalKeyTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

// const inputs = [
//   registerEmail,
//   originUsername,
//   nonce,
//   newkeyType,
//   newKey,
//   newKeySig,
//   keyType,
//   key,
//   sig,
// ];

async function getAddLocalKeyData() {
  const account = getFileData("./mock/account.json", true);
  const rsaKey = getFileData("./mock/addRSAKey.json", true);
  const inner = {
    chainId: 0,
    action: ActionType.ADD_LOCAL_KEY,
    username: account.tempTxData.username,
    registerEmail: account.tempTxData.email,
    pubKey: rsaKey.pubKey,
    keyType: KeyType.RSA,
  };
  const data = new SignMessage(inner);
  const messageHash = await data.messageHash();
  const sig = k1PersonalSign(messageHash, account.k1.privateKey);
  const key = getRSAFromPem(rsaKey.pem);
  const newSign = signMessage(key, messageHash);

  const tempTxData = {
    email: account.tempTxData.email,
    username: account.tempTxData.username,
    oriUsername: account.tempTxData.oriUsername,
    oriEmail: account.tempTxData.oriEmail,
    key: pubKey.toLocaleLowerCase(),
    keyType: KeyType.Secp256K1,
    sig,
    type: RpcActionType.REGISTER,
    emailHeader,
  };
  return { tempTxData, k1 };
}

const rsaKey = await getRSAData();
console.log(JSON.stringify(rsaKey));

async function getAddLocalKeyTxData(username) {
  const initData = await getAddLocalKeyData(username);
  const tx = await addLocalKeyTx(initData.tempTxData, initData.k1.publicKey);
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

// const data = await getAddLocalKeyTxData();
// console.log(data);
