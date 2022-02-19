import { getRSAData } from "./crypto.js";

const data = await getRSAData();
console.log(JSON.stringify(data));
