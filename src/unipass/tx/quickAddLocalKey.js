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
  verifyRSASign,
} from "../utils/crypto.js";
import { getFileData, saveEmailData } from "../utils/file.js";
import { quickAddLocalKeyTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

const argsUsername = process.argv.splice(2);
const fileName = argsUsername[0];
const nonce = argsUsername[1];

async function getTxData() {
  const account = getFileData(`./mock/${fileName}.json`, true);
  const rsaKey = getFileData("./mock/addRSAKey.json", true);
  const inner = {
    chainId: process.env.CHAIN_ID,
    action: ActionType.UPDATE_QUICK_LOGIN,
    username: account.tempTxData.username,
    registerEmail: account.tempTxData.email,
    nonce,
    pubKey: rsaKey.publicKey,
    keyType: KeyType.RSA,
  };
  const data = new SignMessage(inner);
  const messageHash = await data.messageHash();
  const { key, publicKey } = await getRSAFromPem(rsaKey.privatePem);
  const newKeySign = signMessage(key, messageHash);

  const verify = verifyRSASign(messageHash, newKeySign, rsaKey.publicKey);
  console.log({
    verify,
    src: messageHash,
    signature: newKeySign,
    pubkey: rsaKey.publicKey,
  });

  const subject = getSubjectHashData(newKeySign);

  const emailHeader = await getSignEmailWithDkim(
    subject,
    account.tempTxData.oriEmail,
    process.env.BOT_MAIL
  );
  //save file
  saveEmailData("./mock/quick_add_key.eml", emailHeader);
  const email = getFileData(`./email/${fileName}_quick_add_key.eml`);

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
    emailHeader: email,
  };
  const adminSignature = await getQuickAddKeyAdminSin(tempTxData);
  tempTxData.adminSignature = adminSignature;

  return { tempTxData, k1: account.k1 };
}

async function getQuickAddLocalKeyTxData() {
  const initData = await getTxData();
  const tx = await quickAddLocalKeyTx(
    initData.tempTxData,
    initData.k1.publicKey
  );
  return { tempTxData: initData.tempTxData, k1: initData.k1 };
}
await getQuickAddLocalKeyTxData();
