import { createHmac } from "node:crypto";
import { env } from "./env";

function hex(text: string) {
  return Buffer.from(text).toString("hex");
}

type Message = {
  recipient: string;
  content: string;
};

export class SocktopusAuthority {
  constructor(
    private readonly rootURL: string,
    private readonly name: string,
    private readonly secret: string
  ) {}

  grant(connectionId: string) {
    const timestamp = Date.now().toString();
    return [
      hex(timestamp),
      hex(this.name),
      hex(connectionId),
      createHmac("sha256", this.secret)
        .update(timestamp + connectionId)
        .digest("hex"),
    ].join("h");
  }

  async send(messages: Message[]) {
    const resp = await fetch(this.rootURL + "send", {
      headers: [["Content-Type", "application/json"]],
      method: "POST",
      body: JSON.stringify({
        secretName: this.name,
        secret: this.secret,
        messages,
      }),
    });
  }

  sendToMany(content: string, recipients: string[]) {
    return this.send(recipients.map((recipient) => ({ recipient, content })));
  }
}

export const socktopusAuthority = new SocktopusAuthority(
  env.SOCKTOPUS_ROOT_URL,
  env.SOCKTOPUS_NAME,
  env.SOCKTOPUS_SECRET
);
