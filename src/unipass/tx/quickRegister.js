import {
  SignMessage,
  ActionType,
  KeyType,
  RpcActionType,
} from "up-aggregator-utils";
import {
  getHashData,
  k1PersonalSign,
  getRegisterAdminSin,
  emailHash,
} from "../utils/crypto.js";
import { getFileData, saveEmailData } from "../utils/file.js";
import { quickRegisterTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

async function getQuickRegisterData(email) {
  const k1 = getFileData("./mock/ethKey.json", true);
  const username = email.split("@")[0];
  const pubKey = k1.publicKey;
  const inner = {
    chainId: process.env.CHAIN_ID,
    action: ActionType.REGISTER,
    username: getHashData(username),
    registerEmail: emailHash(email),
    pubKey: pubKey,
    keyType: KeyType.Secp256K1,
  };
  const data = new SignMessage(inner);
  const messageHash = await data.messageHash();
  const sig = k1PersonalSign(messageHash, k1.privateKey);

  const tempTxData = {
    email: emailHash(email),
    username: getHashData(username),
    oriUsername: username,
    oriEmail: email,
    key: pubKey.toLocaleLowerCase(),
    keyType: KeyType.Secp256K1,
    sig,
    type: RpcActionType.QuickRegister,
  };
  const adminSignature = await getRegisterAdminSin(tempTxData);
  tempTxData.adminSignature = adminSignature;

  return { tempTxData, k1 };
}
const argsUsername = process.argv.splice(2);
async function getQuickRegisterTxData(username) {
  if (argsUsername.length > 0) username = argsUsername[0];
  console.log({ username, argsUsername });
  const initData = await getQuickRegisterData(username);
  console.log(JSON.stringify(initData));
  saveEmailData(`./mock/${username}.json`, JSON.stringify(initData));
  const tx = await quickRegisterTx(initData.tempTxData, initData.k1.publicKey);
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

const data = await getQuickRegisterTxData("aven1recovery");
console.log(data);
