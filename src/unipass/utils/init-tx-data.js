import { RPC, KeyType, RpcActionType, Transaction } from "up-aggregator-utils";
import * as dotenv from "dotenv";
dotenv.config("./env");

const rpc = new RPC(process.env.RPC);

function initPubkey(key, keyType) {
  let pubkey;
  switch (keyType) {
    case KeyType.RSA:
      const { n, e } = processPubkeyEN(key);
      pubkey = { rsaPubkey: { e, n: `0x${n.toString("hex")}` } };
      break;
    case KeyType.Secp256K1:
      pubkey = { secp256k1: key };
      break;
    case KeyType.Secp256R1:
      pubkey = { secp256r1: key };
      break;
  }
  return pubkey;
}

function initRecoveryEmail(email) {
  const recoveryEmail = {
    firstN: 1,
    threshold: 1,
    emails: [email],
  };

  return recoveryEmail;
}

function initSign(tempAccount) {
  let sig;
  let nonce = tempAccount.nonce;
  switch (tempAccount.type) {
    case RpcActionType.QuickRegister:
      nonce = "0x1";
      sig = {
        signature: tempAccount.sig,
        adminSignature: tempAccount.adminSignature,
      };
      break;
    case RpcActionType.REGISTER:
    case RpcActionType.START_RECOVERY_1:
      sig = {
        emailHeader: tempAccount.headers,
        signature: tempAccount.sig,
      };
      if (tempAccount.type == RpcActionType.REGISTER) {
        nonce = "0x1";
      } else {
        sig.emailHeader = [tempAccount.headers];
      }
      break;

    case RpcActionType.DEL_KEY:
    case RpcActionType.UPDATE_QUICK_LOGIN:
    case RpcActionType.UPDATE_RECOVERY_EMAIL:
    case RpcActionType.CANCEL_RECOVERY:
      sig = {
        signature: tempAccount.sig,
      };

    case RpcActionType.ADD_KEY:
      if (tempAccount.headers) {
        sig = {
          emailHeader: [tempAccount.headers],
          unipassSignature: tempAccount.unipassSignature,
          signature: tempAccount.sig,
        };
      } else if (tempAccount.oldkeySignature) {
        sig = {
          oldkeySignature: tempAccount.oldkeySignature,
          signature: tempAccount.sig,
        };
      }
      break;

    case RpcActionType.START_RECOVERY_2:
    case RpcActionType.FINISH_RECOVERY:
      sig = {
        signature: "0x",
      };

      break;
  }

  return [sig, nonce];
}

function initAction(tempAccount) {
  let action;
  switch (tempAccount.type) {
    case RpcActionType.REGISTER:
    case RpcActionType.QuickRegister:
      let quickLogin = false;
      if (tempAccount.keyType == KeyType.RSA) {
        quickLogin = true;
      }
      action = {
        oriUsername: tempAccount.oriUsername,
        registerEmail: tempAccount.email,
        pubkey: initPubkey(tempAccount.key, tempAccount.keyType),
        recoveryEmail: initRecoveryEmail(tempAccount.email),
        quickLogin,
      };
      break;
    case RpcActionType.DEL_KEY:
      action = {
        pubkey: initPubkey(tempAccount.oldKey, tempAccount.oldKeyType),
      };
      break;
    case RpcActionType.ADD_KEY:
      action = {
        pubkey: initPubkey(tempAccount.key, tempAccount.keyType),
      };
      break;
    case RpcActionType.UPDATE_RECOVERY_EMAIL:
      action = {
        recoveryEmail: initRecoveryEmail(emailHash(tempAccount.recoveryEmail)),
      };
      break;
    case RpcActionType.UPDATE_QUICK_LOGIN:
      action = {
        quickLogin: tempAccount.quickLogin,
      };
      break;

    case RpcActionType.START_RECOVERY_1:
    case RpcActionType.START_RECOVERY_2:
    case RpcActionType.FINISH_RECOVERY:
    case RpcActionType.CANCEL_RECOVERY:
      action = {
        pubkey: initPubkey(tempAccount.key, tempAccount.keyType),
        replaceOld: tempAccount.resetKeys,
      };
      break;
    default:
      return null;
  }
  return action;
}
