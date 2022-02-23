import { saveEmailData } from "../unipass/utils/file.js";

export function quickRegisterInput(rawData) {
  const registerEmail = rawData.email;

  const originUsername = rawData.oriUsername;

  const keyType = rawData.keyType;
  const key = rawData.key;

  const sig = rawData.sig;
  const adminSig = rawData.adminSignature;

  const source = "unipass-wallet";

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
  const registerEmail = rawData.email;

  const originUsername = rawData.oriUsername;

  const emailHeader =
    "0x" + Buffer.from(rawData.emailHeader.trim(), "utf-8").toString("hex");

  const keyType = rawData.keyType;

  const key = rawData.key;

  const sig = rawData.sig;

  const source = "unipass-wallet";

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
  const registerEmail = rawData.email;
  const originUsername = rawData.username;
  const nonce = rawData.nonce;
  const keyType = rawData.newKeyType;
  const key = rawData.newKey;
  const sig = rawData.newKeySign;
  const adminSig = rawData.adminSignature;
  const emailHeader = [
    "0x" + Buffer.from(rawData.emailHeader, "utf-8").toString("hex"),
  ];
  console.log(emailHeader);

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
  saveEmailData("./mock/input.json", JSON.stringify({ inputs }));

  return inputs;
}

export function addLocalKeyInput(rawData) {
  const registerEmail = rawData.email;
  const originUsername = rawData.username;
  const nonce = rawData.nonce;
  const newKeyType = rawData.newKeyType;
  const newKey = rawData.newKey;
  const newKeySign = rawData.newKeySign;
  const keyType = rawData.keyType;
  const key = rawData.key;

  const sig = rawData.sig;

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
  const registerEmail = rawData.email;

  const username = rawData.username;

  const nonce = rawData.nonce;

  const resetKeys = rawData.resetKeys;

  const keyType = rawData.newKeyType;

  const key = rawData.newKey;
  const sig = rawData.newKeySign;

  const emailHeaders = [
    "0x" + Buffer.from(rawData.emailHeader, "utf-8").toString("hex"),
  ];

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
  const registerEmail = rawData.email;

  const username = rawData.username;

  const nonce = rawData.nonce;

  const sigKeyType = rawData.keyType;

  const sigKey = rawData.key;

  const sig = rawData.sig;

  const inputs = [registerEmail, username, nonce, sigKeyType, sigKey, sig];

  return inputs;
}

export function completeRecoveryInput(rawData) {
  const registerEmail = rawData.email;
  const inputs = [registerEmail];

  return inputs;
}

export function delLocalKeyInput(rawData) {
  const registerEmail = rawData.email;
  const username = rawData.username;
  const nonce = rawData.nonce;
  const delKeyType = rawData.delKeyType;
  const delKey = rawData.delKey;
  const sigKeyType = rawData.keyType;
  const sigKey = rawData.key;
  const sig = rawData.sig;

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
  const registerEmail = rawData.email;

  const username = rawData.username;

  const nonce = rawData.nonce;

  const quickLogin = rawData.quickLogin;
  const sigKeyType = rawData.keyType;

  const sigKey = rawData.key;
  const sig = rawData.sig;

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
  const registerEmail = rawData.email;
  const username = rawData.username;
  const nonce = rawData.nonce;
  const emails = [rawData.emails];
  const threshold = rawData.threshold;
  const keyType = rawData.keyType;
  const sigKey = rawData.key;
  const sig = rawData.sig;

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
  const newAdminKeyType = rawData.newAdminKeyType;

  const newAdminKey = rawData.publicKey;

  const newAdminSig = rawData.newAdminSig;

  const oldAdminSig = rawData.oldAdminSig;

  const inputs = [newAdminKeyType, newAdminKey, newAdminSig, oldAdminSig];

  return inputs;
}
