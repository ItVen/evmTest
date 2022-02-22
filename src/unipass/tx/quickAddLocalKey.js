import {
  ActionType,
  KeyType,
  RpcActionType,
  SignMessage,
} from "up-aggregator-utils";
import {
  getSignEmailWithDkim,
  getQuickAddKeyAdminSin,
  getSubjectHashData,
  getRSAFromPem,
  signMessage,
  emailHash,
} from "../utils/crypto.js";
import { getFileData, saveEmailData } from "../utils/file.js";
import { quickAddLocalKeyTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

async function getTxData() {
  const nonce = "0x2";
  const account = getFileData("./mock/account_k1.json", true);
  const rsaKey = getFileData("./mock/addRSAKey.json", true);
  const inner = {
    chainId: process.env.CHAIN_ID,
    action: ActionType.QUICK_ADD_LOCAL_KEY,
    username: account.tempTxData.username,
    registerEmail: account.tempTxData.email,
    nonce,
    pubKey: rsaKey.publicKey,
    keyType: KeyType.RSA,
  };
  console.log(inner);
  const data = new SignMessage(inner);
  const messageHash = await data.messageHash();
  console.log(messageHash);
  const { key, publicKey } = await getRSAFromPem(rsaKey.privatePem);
  const newKeySign = signMessage(key, messageHash);
  const subject = getSubjectHashData(newKeySign);

  const emailHeader = await getSignEmailWithDkim(
    subject,
    account.tempTxData.oriEmail,
    process.env.BOT_MAIL
  );
  //save file
  saveEmailData("./mock/quick_add_key.eml", emailHeader);
  console.log(emailHeader);

  const tempTxData = {
    email: account.tempTxData.email,
    username: account.tempTxData.username,
    oriUsername: account.tempTxData.oriUsername,
    oriEmail: account.tempTxData.oriEmail,
    newKey: publicKey,
    newKeyType: KeyType.RSA,
    newKeySign,
    nonce,
    type: RpcActionType.QUICK_ADD_LOCAL_KEY,
    emailHeader,
  };
  console.log(tempTxData);
  const adminSignature = await getQuickAddKeyAdminSin(tempTxData);
  tempTxData.adminSignature = adminSignature;
  return { tempTxData, k1: account.k1 };
}

async function getQuickAddLocalKeyTxData() {
  const initData = await getTxData();
  console.log(initData);
  const tx = await quickAddLocalKeyTx(
    initData.tempTxData,
    initData.k1.publicKey
  );
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

// const data = await getQuickAddLocalKeyTxData();
// console.log(data);
// const { key, publicKey } = await getRSAFromPem(process.env.UNIPASS_PEM);
// console.log({ key, publicKey });
const oriEmail = "0x35036a691130943550bfcF528DE08432850603ce@mail.unipass.me";
const email = emailHash(oriEmail);
console.log({ email, oriEmail });
