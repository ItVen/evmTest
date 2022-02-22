import { SignMessage, ActionType, KeyType } from "up-aggregator-utils";
import {
  getRSAFromPem,
  getSignEmailWithDkim,
  getSubjectHashData,
  signMessage,
} from "../utils/crypto.js";
import { getFileData, saveEmailData } from "../utils/file.js";
import { startRecoveryTx } from "../../evm/rangers.js";
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
    action: ActionType.START_RECOVERY_1,
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
  const subject = getSubjectHashData(newKeySign);

  const emailHeader = await getSignEmailWithDkim(
    subject,
    account.tempTxData.oriEmail,
    process.env.BOT_MAIL
  );
  saveEmailData("./mock/start_recovery.eml", emailHeader);
  const email = getFileData(`./email/${fileName}_start_recovery.eml`);

  const tempTxData = {
    email: account.tempTxData.email,
    username: account.tempTxData.username,
    oriUsername: account.tempTxData.oriUsername,
    oriEmail: account.tempTxData.oriEmail,
    newKey: publicKey,
    newKeyType: KeyType.RSA,
    newKeySign,
    nonce,
    resetKeys: false,
    emailHeader: email,
  };

  return { tempTxData, k1: account.k1 };
}

async function getStartRecoveryTxData() {
  const initData = await getTxData();
  console.log(initData);
  const tx = await startRecoveryTx(initData.tempTxData, initData.k1.publicKey);
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

const data = await getStartRecoveryTxData();
