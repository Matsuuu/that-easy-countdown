import { __decorate } from "tslib";
import { LitElement, html, property, customElement, } from "lit-element";
let ThatEasyCountdown = class ThatEasyCountdown extends LitElement {
    constructor() {
        super(...arguments);
        this.countdownTarget = Date.now() + 100000;
        this.font = "Roboto";
        this.color = "#000000";
        this.size = 24;
        this.showSetup = true;
    }
    firstUpdated() {
        this.parseUrlParams();
        this.setFont();
        this.setTimer();
    }
    updated(_changedProperties) {
        if (_changedProperties.has("showSetup")) {
            this.setTimer();
        }
    }
    parseUrlParams() {
        const params = window.location.search;
        if (!params) {
            return;
        }
        this.showSetup = false;
        const paramsSplit = params.substring(1).split("&");
        const paramObject = {};
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
    setFont() {
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
    setTimer() {
        var _a;
        const contentHolder = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("h3");
        if (!contentHolder) {
            return;
        }
        setInterval(() => {
            const now = Date.now();
            const timeLeft = this.countdownTarget - now;
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            contentHolder.innerHTML = `${this.handleTrailing(hours)}h ${this.handleTrailing(minutes)}m ${this.handleTrailing(seconds)}s`;
        }, 1000);
    }
    handleTrailing(num) {
        return num < 10 ? "0" + num : num.toString();
    }
    render() {
        if (this.showSetup) {
            return html `${this.setupScreen()}`;
        }
        return html `<style>
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
    toDateTimeLocal(date) {
        return `${date.getFullYear()}-${this.handleTrailing(date.getMonth() + 1)}-${this.handleTrailing(date.getDate())}T${this.handleTrailing(date.getHours())}:${this.handleTrailing(date.getMinutes())}`;
    }
    copySettings() {
        var _a, _b, _c, _d;
        let url = window.location.origin;
        console.log(url);
        const font = ((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#font"))
            .value;
        const color = ((_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("#color"))
            .value;
        const size = ((_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.querySelector("#size"))
            .value;
        const countdownTarget = ((_d = this.shadowRoot) === null || _d === void 0 ? void 0 : _d.querySelector("#time")).value;
        console.log(new Date(countdownTarget).getTime());
        url += `?font=${font}&color=${color}&size=${size}&countdownTarget=${new Date(countdownTarget).getTime()}`;
        const el = document.createElement("textarea");
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
    }
    setupScreen() {
        return html `
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
};
__decorate([
    property({ type: String })
], ThatEasyCountdown.prototype, "countdownTarget", void 0);
__decorate([
    property({ type: String })
], ThatEasyCountdown.prototype, "font", void 0);
__decorate([
    property({ type: String })
], ThatEasyCountdown.prototype, "color", void 0);
__decorate([
    property({ type: Number })
], ThatEasyCountdown.prototype, "size", void 0);
__decorate([
    property({ type: Boolean })
], ThatEasyCountdown.prototype, "showSetup", void 0);
ThatEasyCountdown = __decorate([
    customElement("that-easy-countdown")
], ThatEasyCountdown);
export { ThatEasyCountdown };
//# sourceMappingURL=ThatEasyCountdown.js.map