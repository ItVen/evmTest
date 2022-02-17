import {
  SignMessage,
  ActionType,
  KeyType,
  RpcActionType,
} from "up-aggregator-utils";
import {
  getHashData,
  k1PersonalSign,
  getSignEmailWithDkim,
  emailHash,
  getSubjectHashData,
} from "../utils/crypto.js";
import { getFileData } from "../utils/file.js";
import { registerTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

async function getRegisterData(username) {
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

  const subject = getSubjectHashData(sig);
  const emailHeader = await getSignEmailWithDkim(
    subject,
    email,
    process.env.TRANSFER_MAIL
  );
  console.log(emailHeader);

  const tempTxData = {
    email: emailHash(email),
    username: getHashData(username),
    oriUsername: username,
    oriEmail: email,
    key: pubKey.toLocaleLowerCase(),
    keyType: KeyType.Secp256K1,
    sig,
    type: RpcActionType.REGISTER,
    emailHeader,
  };
  return { tempTxData, k1 };
}

async function getRegisterTxData(username) {
  const initData = await getRegisterData(username);
  const tx = await registerTx(initData.tempTxData, initData.k1.publicKey);
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

const data = await getRegisterTxData("web3_register");
console.log(data);
