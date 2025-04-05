type SocktopusClientOptions = Readonly<{
  rootURL: string;
  initialGrant?: string;
  messageListener: (data: unknown) => void;
  getGrant: () => string | Promise<string>;
  connectionOpenListener?: () => void;
  connectionClosedListener?: () => void;
}>;

const PING = "PING",
  PONG = "PONG",
  CLOSE = "CLOSE";

export class SocktopusClient {
  private pingTimeout: ReturnType<typeof setTimeout> | null = null;
  private webSocket: WebSocket | null = null;

  constructor(public readonly options: SocktopusClientOptions) {
    this.getInitialGrant().then((grant) => this.open(grant));
  }

  private async getInitialGrant() {
    return this.options.initialGrant ?? (await this.options.getGrant());
  }

  private open(grant: string) {
    const recieveURL = new URL(this.options.rootURL + "recieve");
    recieveURL.searchParams.set("token", grant);
    this.webSocket = new WebSocket(recieveURL);
    this.webSocket.onopen = () => this.handleOpen();
    this.webSocket.onclose = () => this.handleClose();
    this.webSocket.onmessage = ({ data }) => this.handleMessage(data);
  }

  private handleMessage(message: string) {
    switch (message) {
      case PONG:
        return this.setPingTimeout();
      case CLOSE:
        return this.webSocket?.close();
    }
    console.log(message);
  }

  private setPingTimeout() {
    this.pingTimeout = setTimeout(() => {
      this.webSocket?.send(PING);
    }, 19_000);
  }

  private async handleClose() {
    this.options.connectionClosedListener?.();
    if (this.pingTimeout !== null) clearTimeout(this.pingTimeout);
    const grant = await this.options.getGrant();
    this.open(grant);
  }

  private handleOpen() {
    this.options.connectionOpenListener?.();
    this.setPingTimeout();
  }
}
