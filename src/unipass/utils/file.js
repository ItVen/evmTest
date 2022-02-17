import fs from "fs";
import path from "path";
const __dirname = path.resolve(path.dirname(""));

export function getFileData(filePath, json) {
  const data = fs.readFileSync(path.join(__dirname, filePath), "utf-8");
  if (json) return JSON.parse(data);
  return data;
}
