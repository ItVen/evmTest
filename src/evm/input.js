import pkg from "web3-utils";
const { encodePacked } = pkg;

function getEncodData(key) {
  return key.v;
}
export function notionQuickRegisterInput(rawData) {
  const registerEmail = getEncodData({
    v: rawData.registerEmail,
    t: "bytes32",
  });

  const originUsername = getEncodData({
    v: rawData.originUsername,
    t: "string",
  });

  const keyType = getEncodData({
    v: rawData.newKeyType,
    t: "uint8",
  });

  const key = getEncodData({
    v: rawData.newKey,
    t: "bytes",
  });

  const sig = getEncodData({
    v: rawData.newKeySig,
    t: "bytes",
  });

  const adminSig = getEncodData({
    v: rawData.adminSig,
    t: "bytes",
  });

  const source = getEncodData({
    v: rawData.source,
    t: "string",
  });

  const inputs = [
    registerEmail,
    originUsername,
    keyType,
    key,
    sig,
    adminSig,
    source,
  ];

  return inputs;
}

export function quickRegisterInput(rawData) {
  const registerEmail = rawData.email;

  const originUsername = rawData.oriUsername;

  const keyType = getEncodData({
    v: rawData.keyType,
    t: "uint8",
  });

  const key = getEncodData({
    v: rawData.key,
    t: "bytes",
  });

  const sig = getEncodData({
    v: rawData.sig,
    t: "bytes",
  });

  const adminSig = getEncodData({
    v: rawData.adminSignature,
    t: "bytes",
  });

  const source = getEncodData({
    v: "unipass-wallet",
    t: "string",
  });

  const inputs = [
    registerEmail,
    originUsername,
    keyType,
    key,
    sig,
    adminSig,
    source,
  ];

  return inputs;
}

export function registerInput(rawData) {
  const registerEmail = getEncodData({
    v: rawData.email,
    t: "bytes32",
  });

  const originUsername = getEncodData({
    v: rawData.oriUsername,
    t: "string",
  });

  const emailHeader =
    "0x" + Buffer.from(rawData.emailHeader.trim(), "utf-8").toString("hex");

  const keyType = getEncodData({
    v: rawData.keyType,
    t: "uint256",
  });

  const key = getEncodData({
    v: rawData.key,
    t: "bytes",
  });

  const sig = getEncodData({
    v: rawData.sig,
    t: "bytes",
  });

  const source = getEncodData({
    v: "unipass-wallet",
    t: "string",
  });

  const inputs = [
    registerEmail,
    originUsername,
    emailHeader,
    keyType,
    key,
    sig,
    source,
  ];

  return inputs;
}

export function quickAddLocalKeyInput(rawData) {
  const registerEmail = getEncodData({
    v: rawData.email,
    t: "bytes32",
  });
  const originUsername = getEncodData({
    v: rawData.username,
    t: "bytes32",
  });
  const nonce = getEncodData({
    v: rawData.nonce,
    t: "uint256",
  });
  const keyType = getEncodData({
    v: rawData.newKeyType,
    t: "uint256",
  });
  const key = getEncodData({
    v: rawData.newKey,
    t: "bytes",
  });
  const sig = getEncodData({
    v: rawData.newKeySign,
    t: "bytes",
  });
  const adminSig = getEncodData({
    v: rawData.adminSignature,
    t: "bytes",
  });
  const emailHeader = getEncodData({
    v: [Buffer.from(rawData.emailHeader, "utf-8").toString("hex")],
    t: "bytes",
  });

  const inputs = [
    registerEmail,
    originUsername,
    nonce,
    keyType,
    key,
    sig,
    adminSig,
    emailHeader,
  ];

  return inputs;
}

export function addLocalKeyInput(rawData) {
  const registerEmail = getEncodData({
    v: rawData.email,
    t: "bytes32",
  });
  const originUsername = getEncodData({
    v: rawData.username,
    t: "bytes32",
  });
  const nonce = getEncodData({
    v: rawData.nonce,
    t: "uint256",
  });
  const newKeyType = getEncodData({
    v: rawData.newKeyType,
    t: "uint256",
  });
  const newKey = getEncodData({
    v: rawData.newKey,
    t: "bytes",
  });
  const newKeySign = getEncodData({
    v: rawData.newKeySign,
    t: "bytes",
  });
  const keyType = getEncodData({
    v: rawData.keyType,
    t: "uint256",
  });
  const key = getEncodData({
    v: rawData.key,
    t: "bytes",
  });

  const sig = getEncodData({
    v: rawData.sig,
    t: "bytes",
  });

  const inputs = [
    registerEmail,
    originUsername,
    nonce,
    newKeyType,
    newKey,
    newKeySign,
    keyType,
    key,
    sig,
  ];

  return inputs;
}

export function startRecoveryInput(rawData) {
  const registerEmail = getEncodData({
    v: rawData.email,
    t: "bytes32",
  });

  const username = getEncodData({
    v: rawData.username,
    t: "bytes32",
  });

  const nonce = getEncodData({
    v: rawData.nonce,
    t: "uint256",
  });

  const resetKeys = getEncodData({
    v: rawData.resetKeys,
    t: "bool",
  });

  const keyType = getEncodData({
    v: rawData.newKeyType,
    t: "uint256",
  });

  const key = getEncodData({
    v: rawData.newKey,
    t: "bytes",
  });
  const sig = getEncodData({
    v: rawData.newKeySign,
    t: "bytes",
  });

  const emailHeaders = getEncodData({
    v: [Buffer.from(rawData.emailHeader, "utf-8").toString("hex")],
    t: "bytes[]",
  });

  const inputs = [
    registerEmail,
    username,
    nonce,
    resetKeys,
    keyType,
    key,
    sig,
    emailHeaders,
  ];

  return inputs;
}

export function cancelRecoveryInput(rawData) {
  const registerEmail = getEncodData({
    v: rawData.email,
    t: "bytes32",
  });

  const username = getEncodData({
    v: rawData.username,
    t: "bytes32",
  });

  const nonce = getEncodData({
    v: rawData.nonce,
    t: "uint256",
  });

  const sigKeyType = getEncodData({
    v: rawData.keyType,
    t: "uint256",
  });

  const sigKey = getEncodData({
    v: rawData.key,
    t: "bytes",
  });

  const sig = getEncodData({
    v: rawData.sig,
    t: "bytes",
  });

  const inputs = [registerEmail, username, nonce, sigKeyType, sigKey, sig];

  return inputs;
}

export function completeRecoveryInput(rawData) {
  const registerEmail = getEncodData({
    v: rawData.email,
    t: "bytes32",
  });
  const inputs = [registerEmail];

  return inputs;
}

export function delLocalKeyInput(rawData) {
  const registerEmail = getEncodData({
    v: rawData.email,
    t: "bytes32",
  });

  const username = getEncodData({
    v: rawData.username,
    t: "bytes32",
  });

  const nonce = getEncodData({
    v: rawData.nonce,
    t: "uint256",
  });

  const delKeyType = getEncodData({
    v: rawData.delKeyType,
    t: "uint256",
  });

  const delKey = getEncodData({
    v: rawData.delKey,
    t: "bytes",
  });
  const sigKeyType = getEncodData({
    v: rawData.keyType,
    t: "uint256",
  });

  const sigKey = getEncodData({
    v: rawData.key,
    t: "bytes",
  });
  const sig = getEncodData({
    v: rawData.sig,
    t: "bytes",
  });

  const inputs = [
    registerEmail,
    username,
    nonce,
    delKeyType,
    delKey,
    sigKeyType,
    sigKey,
    sig,
  ];

  return inputs;
}

export function updateQuickLoginInput(rawData) {
  const registerEmail = getEncodData({
    v: rawData.email,
    t: "bytes32",
  });

  const username = getEncodData({
    v: rawData.username,
    t: "bytes32",
  });

  const nonce = getEncodData({
    v: rawData.nonce,
    t: "uint256",
  });

  const quickLogin = getEncodData({
    v: rawData.quickLogin,
    t: "bool",
  });
  const sigKeyType = getEncodData({
    v: rawData.keyType,
    t: "uint256",
  });

  const sigKey = getEncodData({
    v: rawData.key,
    t: "bytes",
  });
  const sig = getEncodData({
    v: rawData.sig,
    t: "bytes",
  });

  const inputs = [
    registerEmail,
    username,
    nonce,
    quickLogin,
    sigKeyType,
    sigKey,
    sig,
  ];

  return inputs;
}

export function updateRecoveryEmailInput(rawData) {
  const registerEmail = getEncodData({
    v: rawData.email,
    t: "bytes32",
  });

  const username = getEncodData({
    v: rawData.username,
    t: "bytes32",
  });

  const nonce = getEncodData({
    v: rawData.nonce,
    t: "uint256",
  });

  const emails = getEncodData({
    v: rawData.emails,
    t: "bytes32[]",
  });
  const threshold = getEncodData({
    v: rawData.threshold,
    t: "uint256",
  });

  const keyType = getEncodData({
    v: rawData.key,
    t: "uint256",
  });
  const sigKey = getEncodData({
    v: rawData.key,
    t: "bytes",
  });
  const sig = getEncodData({
    v: rawData.sig,
    t: "bytes",
  });

  const inputs = [
    registerEmail,
    username,
    nonce,
    emails,
    threshold,
    keyType,
    sigKey,
    sig,
  ];

  return inputs;
}

export function setAdminInput(rawData) {
  const newAdminKeyType = getEncodData({
    v: rawData.newAdminKeyType,
    t: "uint256",
  });

  const newAdminKey = getEncodData({
    v: rawData.newAdminKey,
    t: "bytes",
  });

  const newadminSig = getEncodData({
    v: rawData.newadminSig,
    t: "bytes",
  });

  const oldadminSig = getEncodData({
    v: rawData.oldadminSig,
    t: "bytes",
  });

  const inputs = [newAdminKeyType, newAdminKey, newadminSig, oldadminSig];

  return inputs;
}
