import { getUsersTx } from "../../evm/rangers.js";
import { emailHash } from "../utils/crypto.js";
import * as dotenv from "dotenv";
dotenv.config("./env");

const argsUsername = process.argv.splice(2);

async function getRegisterTxData(username) {
  if (argsUsername.length > 0) username = argsUsername[0];
  const tx = await getUsersTx(emailHash(username));
  return tx;
}

const data = await getRegisterTxData("b3d9");
console.log(data);
