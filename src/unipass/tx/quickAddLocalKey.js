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

const argsUsername = process.argv.splice(2);
const fileName = argsUsername[0];
const nonce = argsUsername[1];

async function getTxData() {
  const account = getFileData(`./mock/${fileName}.json`, true);
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
  //save file
  saveEmailData("./mock/quick_add_key.eml", emailHeader);
  const email = getFileData(`./email/${fileName}_quick_add_key.eml`);
  console.log(email);

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
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

const data = await getQuickAddLocalKeyTxData();
console.log(data);
// const { key, publicKey } = await getRSAFromPem(process.env.UNIPASS_PEM);
// console.log({ key, publicKey });
// const oriEmail = "0x35036a691130943550bfcF528DE08432850603ce@mail.unipass.me";
// const email = emailHash(oriEmail);
// console.log({ email, oriEmail });
// const newKeySign =
//   "0x37010c9d679883567561c0fbb914eea2663b760ccd4a390d5e8a788f937304f1242c22e164ce9c8c8ec23eddadf83502efe05c5e0553cebc54089a3370a7acef88f97e9e23d44563b67dd92e4c60eafa18f4419369cc216182715ef2f28328f3892d59c96486b1edf12c7a12834d9f48c5a7129b52d0a920ee69b21c1f31a2f8c76417db92b8b89539c7808128b1a056de0644aa3a87993a520f6d188d399a35988c7f795c7c4a2bcd3aa077f28e47b08af415dce0bf7e01cb2fe607c47797312f7cc02f141d806ada8d8a75299593b53b8a1aa49e66b586c6b50558a14ba36b47d225512f08d43ae24d5dcf840a4cdd87060bbad5047891560cd791c7ae763b";
// const subject = getSubjectHashData(newKeySign);
// console.log({ newKeySign, subject });
