import { RPC } from "up-aggregator-utils";
import * as dotenv from "dotenv";
dotenv.config("./env");
const rpc = new RPC(process.env.RPC);
console.log(process.env.RPC);
async function Rangers_getCurrentBlock() {
  const currentBlock = await rpc.Rangers_getCurrentBlock();
  console.log(currentBlock, process.env.RPC);
}
async function Rangers_getBlockByHeight() {
  const currentBlock = await rpc.Rangers_getBlockByHeight();
  console.log(currentBlock, process.env.RPC);
}
Rangers_getCurrentBlock();

Rangers_getBlockByHeight();
