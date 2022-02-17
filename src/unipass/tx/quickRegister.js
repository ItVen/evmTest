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
import { getFileData } from "../utils/file.js";
import { quickRegisterTx } from "../../evm/rangers.js";

async function getQuickRegisterData(username) {
  const k1 = getFileData("./mock/ethKey.json", true);
  const email = k1.publicKey + "@mail.unipass.me";
  const pubKey = k1.publicKey;
  const inner = {
    chainId: 0,
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

async function getQuickRegisterTxData(username) {
  const initData = await getQuickRegisterData(username);
  const tx = await quickRegisterTx(initData.tempTxData, initData.k1.publicKey);
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

const data = await getQuickRegisterTxData("abcdef");
console.log(data);
