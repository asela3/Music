import SES from "aws-sdk/clients/ses.js";

export const DATABASE =
  "mongodb+srv://asela:RxQ9MV2jIMGDBms9@music.lja26kx.mongodb.net/?retryWrites=true&w=majority";

export const AWS_ACCESS_KEY_ID = "AKIAYUCFJED7Y6LPLNEP";
export const AWS_SECRET_ACCESS_KEY = "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";

export const EMAIL_FROM = '"Real State" <aselajayathilake2@gmail.com>';
export const REPLY_TO = "aselajayathilake2@gmail.com";

export const AWS_SES = new SES({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: "ap-northeast-1",
  apiVersion: "2010-12-01",
});

export const JWT_SECRET = "HFSDJGDFJGJjjh8785687568HJHJ89809";

export const CLIENT_URL = "https://magnificent-alpaca-311c3c.netlify.app";
