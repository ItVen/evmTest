import Web3 from "@rangersprotocolweb3/web3";
import {
  quickRegisterInput,
  registerInput,
  quickAddLocalKeyInput,
  addLocalKeyInput,
  delLocalKeyInput,
  startRecoveryInput,
  cancelRecoveryInput,
  completeRecoveryInput,
  updateQuickLoginInput,
  updateRecoveryEmailInput,
  setAdminInput,
  notionQuickRegisterInput,
} from "./input.js";
import { getFileData } from "../unipass/utils/file.js";

const web3 = new Web3(
  "wss://robin.rangersprotocol.com/pubhub/api/reader",
  "wss://robin.rangersprotocol.com/pubhub/api/writer",
  "wss://robin-sub.rangersprotocol.com"
);

const myAddress = getFileData("./mock/ethKey.json", true);
web3.eth.accounts.wallet.add(myAddress.privateKey);
const abi = getFileData("./mock/abi.json", true);
const contract = new web3.eth.Contract(
  abi,
  "0xfb0ba1eb50831297db0c49e4fcc743830546467d"
);

export async function notionQuickRegisterTx(rawData, from) {
  const inputs = notionQuickRegisterInput(rawData);
  console.log(inputs);
  try {
    console.log({ inputs, from });
    contract.methods
      .quickRegister(...inputs)
      .send({ from: myAddress.publicKey })
      .on("transactionHash", function (hash) {
        console.log("transactionHash");
        console.log({ hash });
      })
      .on("receipt", function (receipt) {
        console.log("receipt");
        console.log({ receipt });
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log("confirmation");
        console.log({ confirmationNumber, receipt });
      })
      .on("error", function (error, receipt) {
        console.log("error");
        console.log({ error, receipt });
      });
  } catch (err) {
    console.log({ err });
  }
}

export async function quickRegisterTx(rawData, from) {
  const inputs = quickRegisterInput(rawData);
  try {
    console.log({ inputs, from });
    contract.methods
      .quickRegister(...inputs)
      .send({ from: myAddress.publicKey })
      .on("transactionHash", function (hash) {
        console.log("transactionHash");
        console.log({ hash });
      })
      .on("receipt", function (receipt) {
        console.log("receipt");
        console.log({ receipt });
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log("confirmation");
        console.log({ confirmationNumber, receipt });
      })
      .on("error", function (error, receipt) {
        console.log("error");
        console.log({ error, receipt });
      });
  } catch (err) {
    console.log({ err });
  }
}

export async function registerTx(rawData, from) {
  const inputs = registerInput(rawData);
  try {
    console.log({ inputs, from });
    const txData = await contract.methods.register(...inputs).send({ from });
    console.log({ txData });
  } catch (err) {
    console.log({ err });
  }
}

export async function getUsers(rawData, from) {
  const inputs = registerInput(rawData);
  try {
    console.log({ inputs: JSON.stringify(inputs), from });
    const txData = await contract.methods.register(...inputs).send({ from });
    console.log({ txData });
  } catch (err) {
    console.log({ err });
  }
}

export async function quickAddLocalKeyTx(rawData, from) {
  const inputs = quickAddLocalKeyInput(rawData);
  try {
    console.log({ inputs, from });
    const txData = await contract.methods
      .quickAddLocalKey(...inputs)
      .send({ from });
    console.log({ txData });
  } catch (err) {
    console.log({ err });
  }
}

export async function addLocalKeyTx(rawData, from) {
  const inputs = addLocalKeyInput(rawData);
  try {
    console.log({ inputs, from });
    const txData = await contract.methods.addLocalKey(...inputs).send({ from });
    console.log({ txData });
  } catch (err) {
    console.log({ err });
  }
}

export async function delLocalKeyTx(rawData, from) {
  const inputs = delLocalKeyInput(rawData);
  try {
    console.log({ inputs, from });
    const txData = await contract.methods.delLocalKey(...inputs).send({ from });
    console.log({ txData });
  } catch (err) {
    console.log({ err });
  }
}

export async function startRecoveryTx(rawData, from) {
  const inputs = startRecoveryInput(rawData);
  try {
    console.log({ inputs, from });
    const txData = await contract.methods
      .startRecovery(...inputs)
      .send({ from: myAddress.publicKey });
    console.log({ txData });
  } catch (err) {
    console.log({ err });
  }
}

export async function cancelRecoveryTx(rawData, from) {
  const inputs = cancelRecoveryInput(rawData);
  try {
    console.log({ inputs, from });
    const txData = await contract.methods
      .cancelRecovery(...inputs)
      .send({ from: myAddress.publicKey });
    console.log({ txData });
  } catch (err) {
    console.log({ err });
  }
}

export async function completeRecoveryTx(rawData, from) {
  const inputs = completeRecoveryInput(rawData);
  try {
    console.log({ inputs, from });
    const txData = await contract.methods
      .completeRecovery(...inputs)
      .send({ from: myAddress.publicKey });
    console.log({ txData });
  } catch (err) {
    console.log({ err });
  }
}

export async function updateQuickLoginTx(rawData, from) {
  const inputs = updateQuickLoginInput(rawData);
  try {
    console.log({ inputs, from });
    const txData = await contract.methods
      .updateQuickLogin(...inputs)
      .send({ from: myAddress.publicKey });
    console.log({ txData });
  } catch (err) {
    console.log({ err });
  }
}

export async function updateRecoveryEmailTx(rawData, from) {
  const inputs = updateRecoveryEmailInput(rawData);
  try {
    console.log({ inputs, from });
    const txData = await contract.methods
      .updateRecoveryEmail(...inputs)
      .send({ from: myAddress.publicKey });
    console.log({ txData });
  } catch (err) {
    console.log({ err });
  }
}

export async function setAdminTx(rawData, from) {
  const inputs = setAdminInput(rawData);
  try {
    console.log({ inputs, from: myAddress.publicKey });
    const txData = await contract.methods
      .setAdmin(...inputs)
      .send({ from: myAddress.publicKey });
    console.log({ txData });
  } catch (err) {
    console.log({ err });
  }
}

export async function getUsersTx(username) {
  try {
    console.log({ username });
    const txData = await contract.methods
      .users(username)
      .call({ from: myAddress.publicKey });
    console.log({ txData });
    return txData;
  } catch (err) {
    console.log({ err });
  }
}
