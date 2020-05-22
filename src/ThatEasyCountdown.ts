import {
  LitElement,
  html,
  css,
  property,
  customElement,
  TemplateResult,
  PropertyValues,
} from "lit-element";

@customElement("that-easy-countdown")
export class ThatEasyCountdown extends LitElement {
  @property({ type: String })
  countdownTarget: number = Date.now() + 100000;

  @property({ type: String })
  font: string = "Roboto";

  @property({ type: String })
  color: string = "#000000";

  @property({ type: Number })
  size: number = 24;

  @property({ type: Boolean })
  showSetup: boolean = true;

  firstUpdated() {
    this.parseUrlParams();
    this.setFont();
    this.setTimer();
  }

  updated(_changedProperties: PropertyValues) {
    if (_changedProperties.has("showSetup")) {
      this.setTimer();
    }
  }

  parseUrlParams(): void {
    const params: string = window.location.search;
    if (!params) {
      return;
    }
    this.showSetup = false;
    const paramsSplit: Array<string> = params.substring(1).split("&");

    const paramObject: { [key: string]: string } = {};
    for (let param of paramsSplit) {
      const splitSearchParam = param.split("=");
      paramObject[splitSearchParam[0]] = splitSearchParam[1];
    }

    if (paramObject.font) {
      this.font = paramObject.font;
    }
    if (paramObject.color) {
      this.color = paramObject.color;
    }
    if (paramObject.size) {
      this.size = Number(paramObject.size);
    }
    if (paramObject.countdownTarget) {
      this.countdownTarget = Number(paramObject.countdownTarget);
    }
  }

  setFont(): void {
    console.log(document.body);
    const fontImport = document.createElement("link");
    fontImport.href = `https://fonts.googleapis.com/css2?family=${this.font}&display=swap`;
    fontImport.rel = "stylesheet";
    document.head.append(fontImport);

    const fontStyles = document.createElement("style");
    fontStyles.innerHTML = `
      `;
    document.head.append(fontStyles);
  }

  setTimer(): void {
    const contentHolder = this.shadowRoot?.querySelector("h3");
    if (!contentHolder) {
      return;
    }
    setInterval(() => {
      const now = Date.now();
      const timeLeft = this.countdownTarget - now;

      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      contentHolder.innerHTML = `${this.handleTrailing(
        hours
      )}h ${this.handleTrailing(minutes)}m ${this.handleTrailing(seconds)}s`;
    }, 1000);
  }

  handleTrailing(num: number): string {
    return num < 10 ? "0" + num : num.toString();
  }

  render(): TemplateResult {
    if (this.showSetup) {
      return html`${this.setupScreen()}`;
    }
    return html`<style>
        :host {
          font-family: "${this.font.replace("+", " ")}", sans-serif;
          color: #${this.color};
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100%;
        }
        h3 {
          font-size: ${this.size}px;
        }
      </style>
      <h3></h3>`;
  }

  toDateTimeLocal(date: Date): string {
    return `${date.getFullYear()}-${this.handleTrailing(
      date.getMonth() + 1
    )}-${this.handleTrailing(date.getDate())}T${this.handleTrailing(
      date.getHours()
    )}:${this.handleTrailing(date.getMinutes())}`;
  }

  copySettings(): void {
    let url: string = window.location.origin;
    console.log(url);

    const font = (this.shadowRoot?.querySelector("#font") as HTMLInputElement)
      .value;
    const color = (this.shadowRoot?.querySelector("#color") as HTMLInputElement)
      .value;
    const size = (this.shadowRoot?.querySelector("#size") as HTMLInputElement)
      .value;
    const countdownTarget = (this.shadowRoot?.querySelector(
      "#time"
    ) as HTMLInputElement).value;

    console.log(new Date(countdownTarget).getTime());
    url += `?font=${font}&color=${color}&size=${size}&countdownTarget=${new Date(
      countdownTarget
    ).getTime()}`;

    const el = document.createElement("textarea");
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  setupScreen(): TemplateResult {
    return html`
      <style>
        .setup-wrapper {
          display: flex;
          justify-content: center;
          flex-direction: column;
          width: 60%;
          margin: 10% auto 0;
        }

        input {
          font-size: 2rem;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.9);
          margin: 0 0 1rem 0;
        }
      </style>
      <div class="setup-wrapper">
        <h2>Set up timer</h2>
        <p>
          Write the font name with a capital letter. If the name consists of
          more than one word, seperate the words with a plus. e.g. Open+Sans
        </p>
        <p>The fonts are loaded from Google fonts</p>
        <input type="text" placeholder="Font name" id="font" value="Roboto" />
        <input type="text" placeholder="Color" id="color" value="000000" />
        <input type="number" placeholder="Font size" id="size" value="24" />
        <input
          type="datetime-local"
          value="${this.toDateTimeLocal(new Date())}"
          placeholder="Countdown time"
          id="time"
        />
        <button @click=${this.copySettings}>Copy to clipboard</button>
        <p>
          After copying the settings to clipboard, just paste it to your browser
          or OBS or whatever.
        </p>
      </div>
    `;
  }
}
