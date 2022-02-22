import { getFileData } from "../utils/file.js";
import { quickRegisterTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

async function getAddLocalKeyTxData() {
  const data = getFileData(`./mock/nr.json`, true);
  const k1 = getFileData(`./mock/ethKey.json`, true);

  const tempTxData = {
    ...data,
  };
  return { tempTxData, k1 };
}

async function quickRegister() {
  const initData = await getAddLocalKeyTxData();
  const tx = await quickRegisterTx(initData.tempTxData, initData.k1.publicKey);
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

const data = await quickRegister();
console.log(data);
