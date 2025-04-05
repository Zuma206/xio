import { createHmac } from "node:crypto";

function hex(text: string) {
  return Buffer.from(text).toString("hex");
}

export function authority(name: string, secret: string) {
  return {
    async grant(connectionId: string) {
      const timestamp = Date.now().toString();
      return [
        hex(timestamp),
        hex(name),
        hex(connectionId),
        createHmac("sha256", secret)
          .update(timestamp + connectionId)
          .digest("hex"),
      ].join("h");
    },
  };
}
