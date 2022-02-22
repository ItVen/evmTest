import { getFileData } from "../utils/file.js";
import { quickAddLocalKeyTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

async function getAddLocalKeyTxData() {
  const data = getFileData(`./mock/nqak.json`, true);
  const emailHeader = getFileData(`./email/email_header.eml`);
  const k1 = getFileData(`./mock/ethKey.json`, true);

  const tempTxData = {
    ...data,
    emailHeader,
  };
  return { tempTxData, k1 };
}

async function quickAddLocalKey() {
  const initData = await getAddLocalKeyTxData();
  const tx = await quickAddLocalKeyTx(
    initData.tempTxData,
    initData.k1.publicKey
  );
  return { tempTxData: initData.tempTxData, k1: initData.k1, tx };
}

const data = await quickAddLocalKey();
console.log(data);
