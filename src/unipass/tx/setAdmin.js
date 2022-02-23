import { SignMessage, ActionType, KeyType } from "up-aggregator-utils";
import { getRSAFromPem, extractPubkey } from "../utils/crypto.js";
import { getFileData } from "../utils/file.js";
import { setAdminTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

async function getData() {
  const newRSA = getFileData("./mock/admin-rsa.json", true);
  const adminKey = getFileData("./mock/adminkey.json", true);
  const adminData = await getRSAFromPem(adminKey.privatePem, true);
  const newAdminData = await getRSAFromPem(newRSA.privatePem, true);

  const inner = {
    chainId: 0,
    action: ActionType.newAdminKeyType,
    pubKey: newAdminData.publicKey,
    keyType: KeyType.RSA,
  };
  const data = new SignMessage(inner);
  const messageHash = await data.messageHash();
  const newAdminSig =
    "0x" +
    newAdminData.key.sign(
      Buffer.from(messageHash.replace("0x", ""), "hex"),
      "hex"
    );
  const oldAdminSig =
    "0x" +
    adminData.key.sign(
      Buffer.from(messageHash.replace("0x", ""), "hex"),
      "hex"
    );
  const publicKey = await extractPubkey(newAdminData.key);

  const tempTxData = {
    newAdminSig,
    oldAdminSig,
    publicKey,
    newAdminKeyType: KeyType.RSA,
  };
  return { tempTxData };
}

async function setAdmin() {
  const initData = await getData();
  console.log(initData);
  const tx = await setAdminTx(initData.tempTxData);
  return { tempTxData: initData.tempTxData, tx };
}

setAdmin();
