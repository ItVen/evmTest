import CryptoJs from "crypto-js";
import { createHash } from "crypto";
import bitcore from "bitcore-lib";
import NodeRSA from "node-rsa";
import { Account } from "eth-lib";
import { ecsign, hashPersonalMessage, toRpcSig } from "ethereumjs-util";
import { SignMessage, ActionType } from "up-aggregator-utils";
import MailComposer from "nodemailer/lib/mail-composer/index.js";
import { signEmailWithDkim } from "./dkim.js";
import DKIM from "nodemailer/lib/dkim/index.js";
import { getFileData } from "./file.js";

import * as dotenv from "dotenv";
dotenv.config("./env");
const MAX_EMAIL_LEN = 100;
const FR_EMAIL_LEN = Math.floor(MAX_EMAIL_LEN / 31) + 1;
const MIN_EMAIL_LEN = 6;

export function getHashData(data) {
  if (!data) return "";
  const sha256 = CryptoJs.SHA256(data);
  data = CryptoJs.enc.Hex.stringify(sha256);
  return `0x${data}`;
}

function updateEmail(email) {
  if (!email) return "";
  if (email.length < MIN_EMAIL_LEN || email.length > MAX_EMAIL_LEN) {
    throw new Error("Invalid email length");
  }
  email = email.toLocaleLowerCase().trim();
  const emailData = email.split("@");
  let prefix = emailData[0].split("+")[0];
  if (emailData[1] != "gmail.com") return `${prefix}@${emailData[1]}`;
  const reg = new RegExp(/[\.]+/, "g");
  prefix = prefix.trim().replace(reg, "");
  return `${prefix}@${emailData[1]}`;
}

export function emailHash(email) {
  email = updateEmail(email);
  if (!email) return;

  const split = email.split("@", 2);
  let hash = createHash("sha256").update(split[0]).update("@").update(split[1]);
  let i;
  const len = split[0].length + 1 + split[1].length;
  for (i = 0; i < FR_EMAIL_LEN * 31 - len; ++i)
    hash = hash.update(new Uint8Array([0]));
  const hashRes = hash.digest();
  const hashResRev = hashRes.reverse();
  hashResRev[31] &= 0x1f;
  return "0x" + hashResRev.toString("hex");
}

export function getK1Data() {
  const Networks = bitcore.Networks;
  const PrivateKey = bitcore.PrivateKey;
  Networks.defaultNetwork = Networks.testnet;
  const testKey = PrivateKey.fromRandom();
  const k1PrivateKey = "0x" + testKey.toString();
  const pubKey = Account.fromPrivate(k1PrivateKey).address;
  return {
    privateKey: "0x" + testKey.toString(),
    publicKey: pubKey,
  };
}
export function k1PersonalSign(hash, privateKey) {
  const personalHash = hashPersonalMessage(hash.hexToBuffer());
  const sig = ecsign(personalHash, privateKey.hexToBuffer());
  return toRpcSig(sig.v, sig.r, sig.s);
}

export async function getRSAData() {
  const key = new NodeRSA({ b: 2048 });
  key.setOptions({ signingScheme: "pkcs1-sha256" });
  const pubKey = await extractPubkey(key);
  const privatePem = key.exportKey("pkcs8-private");
  return {
    pubKey,
    privatePem,
  };
}

export async function getRSAFromPem(pem) {
  const key = new NodeRSA(pem);
  key.setOptions({ signingScheme: "pkcs1-sha256" });
  const publicKey = await extractPubkey(key);
  return {
    publicKey,
    key,
  };
}

export async function extractPubkey(privateKey) {
  const data = await privateKey.exportKey("components-private");
  const e = data.e.toString(16).padStart(8, "0");
  const n = data.n.slice(1);
  const eVec = Buffer.from(e, "hex");
  const nVec = n;
  const pubKey = "0x" + Buffer.concat([eVec, nVec]).toString("hex");
  return pubKey;
}

export function processPubkeyEN(pubkey) {
  const pubkeyBuffer = Buffer.from(pubkey.replace("0x", ""), "hex");
  const e = pubkeyBuffer.slice(0, 4).readUInt32BE();
  const n = pubkeyBuffer.slice(4);
  return { e, n };
}

export function signMessage(masterKey, messageHex) {
  const sig =
    "0x" +
    masterKey.sign(Buffer.from(messageHex.replace("0x", ""), "hex"), "hex");

  return sig;
}

export async function getAdminSin(
  username,
  nonce,
  newKey,
  keyType,
  registerEmail
) {
  const key = new NodeRSA(process.env.UNIPASS_PEM);
  key.setOptions({ signingScheme: "pkcs1-sha256" });

  const inner = {
    chainId: parseInt(process.env.CHAIN_ID),
    action: ActionType.QUICK_ADD_LOCAL_KEY,
    username,
    keyType,
    pubKey: newKey,
    nonce,
    registerEmail,
  };
  const data = new SignMessage(inner);
  const messageHash = await data.messageHash();
  const sig =
    "0x" + key.sign(Buffer.from(messageHash.replace("0x", ""), "hex"), "hex");
  return sig;
}

export async function getRegisterAdminSin(quickRegisterAccountInput) {
  const key = new NodeRSA(process.env.UNIPASS_PEM);

  key.setOptions({ signingScheme: "pkcs1-sha256" });
  const inner = {
    chainId: parseInt(process.env.CHAIN_ID),
    action: ActionType.REGISTER,
    username: quickRegisterAccountInput.username,
    pubKey: quickRegisterAccountInput.key,
    keyType: quickRegisterAccountInput.keyType,
    registerEmail: quickRegisterAccountInput.email,
  };
  const data = new SignMessage(inner);
  const messageHash = await data.messageHash();

  const sig =
    "0x" + key.sign(Buffer.from(messageHash.replace("0x", ""), "hex"), "hex");
  return sig;
}

export function getSubjectHashData(data) {
  if (!data) return "";
  data = CryptoJs.enc.Hex.stringify(
    CryptoJs.SHA256(CryptoJs.enc.Hex.parse(data.replace("0x", "")))
  );

  return `0x${data}`;
}

export async function getSignEmailWithDkim(subject, from, to) {
  const mail = new MailComposer({
    from: from,
    to,
    subject,
    html: "<b>Unipass Test</b>",
  });
  const privateKey = getFileData("./pem/privateKey.pem");

  const dkim = new DKIM({
    keySelector: "eth",
    domainName: "unipass.id",
    privateKey: privateKey,
  });
  const email = await signEmailWithDkim(mail, dkim);
  return email.toString();
}
