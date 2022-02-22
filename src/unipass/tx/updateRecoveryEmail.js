import { SignMessage, ActionType, KeyType } from "up-aggregator-utils";
import { k1PersonalSign, emailHash } from "../utils/crypto.js";
import { getFileData } from "../utils/file.js";
import { updateRecoveryEmailTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");
const argsUsername = process.argv.splice(2);
const fileName = argsUsername[0];
const nonce = argsUsername[1];
const recoveryEmail = argsUsername[2];

async function getData() {
  const account = getFileData(`./mock/${fileName}.json`, true);

  const inner = {
    chainId: 0,
    action: ActionType.UPDATE_RECOVERY_EMAIL,
    username: account.tempTxData.username,
    registerEmail: account.tempTxData.email,
    pubKey: account.k1.publicKey,
    keyType: KeyType.Secp256K1,
    recoveryEmail: [emailHash(recoveryEmail)],
    threshold: 1,
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
    emails: emailHash(recoveryEmail),
    threshold: 1,
    sig,
  };
  return { tempTxData, k1: account.k1 };
}

async function updateRecoveryEmail() {
  const initData = await getData();
  const tx = await updateRecoveryEmailTx(
    initData.tempTxData,
    initData.k1.publicKey
  );
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

await updateRecoveryEmail();
