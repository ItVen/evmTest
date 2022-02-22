import {
  SignMessage,
  ActionType,
  KeyType,
  RpcActionType,
} from "up-aggregator-utils";
import {
  getHashData,
  k1PersonalSign,
  getSignEmailWithDkim,
  emailHash,
  getSubjectHashData,
} from "../utils/crypto.js";
import { getFileData, saveEmailData } from "../utils/file.js";
import { registerTx } from "../../evm/rangers.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

const argsUsername = process.argv.splice(2);
async function getRegisterTxData(username) {
  if (argsUsername.length > 0) username = argsUsername[0];
  console.log({ username });
  const tx = await registerTx(initData.tempTxData, initData.k1.publicKey);
  return tx;
}

const data = await getRegisterTxData("b3d9");
console.log(data);
