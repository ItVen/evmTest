import { composePubkey } from "../utils/crypto.js";
import { getFileData } from "../utils/file.js";
import { notionQuickRegisterTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

async function getQuickRegisterData() {
  const registerData = getFileData("./mock/notion_account.json", true);
  const newKey = await composePubkey(
    registerData.newKey.e,
    registerData.newKey.n
  );

  const adminKey = await composePubkey(
    registerData.adminKey.e,
    registerData.adminKey.n
  );
  registerData.newKey = newKey;
  registerData.adminKey = adminKey;
  console.log(registerData);
  return registerData;
}

async function getQuickRegisterTxData() {
  const initData = await getQuickRegisterData();
  const k1 = {
    privateKey:
      "0x7a896bdf1d55999ae43ff5fb3c0b36b6fdf2014175686fe579bdc528361f9268",
    publicKey: "0x35036a691130943550bfcF528DE08432850603ce",
  };
  const tx = await notionQuickRegisterTx(initData, k1.publicKey);
  return { tempTxData: initData.tempTxData, k1: k1, tx };
}

const data = await getQuickRegisterTxData();
console.log(data);
