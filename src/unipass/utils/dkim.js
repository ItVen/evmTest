import DKIMVerify from "node-dkim";

export async function verifyDkim(mail) {
  return await new Promise(function (resolve, reject) {
    DKIMVerify.verify(Buffer.from(mail), function (error, result) {
      if (error) reject(error);
      resolve(result);
    });
  });
}

export async function signEmailWithDkim(mail, dkim) {
  return new Promise((resolve, reject) => {
    mail.compile().build((err, msg) => {
      const signedMsg = dkim.sign(msg);

      const buffers = [];
      signedMsg.on("data", (msg) => {
        buffers.push(msg);
      });

      signedMsg.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      signedMsg.on("error", (err) => {
        reject(err);
      });
    });
  });
}
