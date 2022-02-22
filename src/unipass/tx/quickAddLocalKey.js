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

// const { key, publicKey } = await getRSAFromPem(process.env.UNIPASS_PEM);
// console.log({ key, publicKey });
// const oriEmail = "0x35036a691130943550bfcF528DE08432850603ce@mail.unipass.me";
// const email = emailHash(oriEmail);
// console.log({ email, oriEmail });
// const newKeySign =
//   "0x37010c9d679883567561c0fbb914eea2663b760ccd4a390d5e8a788f937304f1242c22e164ce9c8c8ec23eddadf83502efe05c5e0553cebc54089a3370a7acef88f97e9e23d44563b67dd92e4c60eafa18f4419369cc216182715ef2f28328f3892d59c96486b1edf12c7a12834d9f48c5a7129b52d0a920ee69b21c1f31a2f8c76417db92b8b89539c7808128b1a056de0644aa3a87993a520f6d188d399a35988c7f795c7c4a2bcd3aa077f28e47b08af415dce0bf7e01cb2fe607c47797312f7cc02f141d806ada8d8a75299593b53b8a1aa49e66b586c6b50558a14ba36b47d225512f08d43ae24d5dcf840a4cdd87060bbad5047891560cd791c7ae763b";
// const subject = getSubjectHashData(newKeySign);
// console.log({ newKeySign, subject });
//src, signature, pubkey
// const src =
//   "0x545c26054d91bc9eed011da10c5c6e89bd7107bd8cffd32b4732fef390da8547";
// const signature =
//   "0x37010c9d679883567561c0fbb914eea2663b760ccd4a390d5e8a788f937304f1242c22e164ce9c8c8ec23eddadf83502efe05c5e0553cebc54089a3370a7acef88f97e9e23d44563b67dd92e4c60eafa18f4419369cc216182715ef2f28328f3892d59c96486b1edf12c7a12834d9f48c5a7129b52d0a920ee69b21c1f31a2f8c76417db92b8b89539c7808128b1a056de0644aa3a87993a520f6d188d399a35988c7f795c7c4a2bcd3aa077f28e47b08af415dce0bf7e01cb2fe607c47797312f7cc02f141d806ada8d8a75299593b53b8a1aa49e66b586c6b50558a14ba36b47d225512f08d43ae24d5dcf840a4cdd87060bbad5047891560cd791c7ae763b";

// const pubkey =
//   "0x0001000185283a0b202df68e130a76259e6e57dfa6f28809448dec396bd6401f111941a5a1eefb1bebb9d0b3732146c08c97af5a608d8606ebc97bf7938e68f2a7429be405c97e615f7e2c45ddd282e94dc2fe434614fe31822a4827db2d9f8265a79c36d049cd7fc682cd1a2d71fbf60a09c0282c9114b5649f35807e07aa59b78abf7af8911b35ae2fe55ce72252b5abf4326a3cd76b2b5a1a4a4a78a53a5be41f6390f851239b00592078802f6296d6151f37aa089934ffba97af15de579caaf633cb3464d6060fe8c9f9118118c77b7bfe6f41381393d45f77ee9efbcdfe57061582f6e2dc2f9c73bc89c23ad19a49e51970bb0b8623e49ba2f44ca62bc75f4f8521";
// const verify = verifyV2RSASign(src, signature, pubkey);
// console.log({ verify, src, signature, pubkey });
