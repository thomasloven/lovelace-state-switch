import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { deviceID } from "card-tools/src/deviceID";
import { hasTemplate } from "card-tools/src/templates";
import { bind_template, unbind_template } from "./templates";
import { HassObject, LovelaceCard, StateSwitchConfig } from "./types";

class StateSwitch extends LitElement {
  @property() _config: StateSwitchConfig;
  @property() hass: HassObject;
  @property() state;
  @property() _tmpl;

  cards: Record<string, LovelaceCard>;

  async setConfig(config) {
    this._config = config;

    this.state = undefined;
    this.classList.add("no-match");
    this.cards = {};

    this.buildCards();

    if (config.entity === "hash") {
      window.addEventListener("location-changed", () =>
        this.updated(new Map())
      );
      window.addEventListener("hashchange", () => this.updated(new Map()));
    }
    if (config.entity === "mediaquery") {
      for (const q in this.cards) {
        window.matchMedia(q).addListener(this.update_state.bind(this));
      }
    }
    if (config.entity === "template" || hasTemplate(config.entity)) {
      const tmpl = hasTemplate(config.entity) ? config.entity : config.template;
      bind_template(this.templateRenderer, tmpl, { config });
    }

    this.style.setProperty("display", "none");
  }

  templateRenderer = (tpl) => {
    this._tmpl = tpl;
  };

  connectedCallback() {
    super.connectedCallback();
    if (!this._config) return;
    if (
      this._config.entity === "template" ||
      hasTemplate(this._config.entity)
    ) {
      bind_template(
        this.templateRenderer,
        hasTemplate(this._config.entity)
          ? this._config.entity
          : this._config.template,
        { config: this._config }
      );
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    unbind_template(this.templateRenderer);
  }

  async buildCards() {
    const helpers = await (window as any).loadCardHelpers();
    for (let k in this._config.states) {
      this.cards[k] = await helpers.createCardElement(this._config.states[k]);
      this.cards[k].hass = this.hass;
    }
    this.update_state();
  }

  update_state() {
    let newstate = undefined;
    switch (this._config.entity) {
      case "template":
        newstate = this._tmpl;
        break;
      case "user":
        newstate = this.hass?.user?.name;
        break;
      case "group":
        newstate = this.hass?.user?.is_admin ? "admin" : "user";
        break;
      case "deviceID":
      case "browser":
        newstate = deviceID;
        break;
      case "hash":
        newstate = location.hash.substr(1);
        break;
      case "mediaquery":
        for (const q in this.cards) {
          if (window.matchMedia(q).matches) {
            newstate = q;
            break;
          }
        }
        break;
      default:
        newstate = this.hass?.states[this._config.entity]?.state;
    }

    if (newstate === undefined || !this.cards.hasOwnProperty(newstate))
      newstate = this._config.default;
    this.state = newstate;
  }

  updated(changedProperties) {
    if (changedProperties.has("hass"))
      for (let k in this.cards) this.cards[k].hass = this.hass;

    if (!changedProperties.has("state")) {
      this.update_state();
    } else {
      const oldState = changedProperties.get("state");
      if (this.cards[oldState]) {
        this.cards[oldState].classList.remove("visible");
        this.cards[oldState].classList.add("out");
        window.setTimeout(() => {
          this.cards[oldState].classList.remove("out");
        }, this._config.transition_time || 500);
      }
      if (this.cards[this.state]) {
        this.cards[this.state].classList.add("visible");
        this.classList.remove("no-match");
        this.style.setProperty("display", "");
      } else {
        this.classList.add("no-match");
        this.style.setProperty("display", "none");
      }
    }
  }

  render() {
    return html`
      <div
        id="root"
        class="${this._config.transition}"
        style="
        transition-duration: ${this._config.transition_time || 500}ms;
        transition-delay: ${this._config.transition_time || 500}ms;
        "
      >
        ${Object.keys(this.cards).map((k) => html` ${this.cards[k]} `)}
      </div>
    `;
  }

  getCardSize() {
    let sz = 1;
    for (let k in this.cards) {
      if (this.cards[k]?.getCardSize)
        sz = Math.max(sz, this.cards[k].getCardSize());
    }
    return sz;
  }

  static get styles() {
    return css`
      :host {
        perspective: 1000px;
      }
      :host(.no-match) {
        display: none;
      }
      #root {
        overflow: hidden;
        xborder: 1px solid red;
        display: grid;
      }
      #root * {
        display: none;
        grid-column: 1;
        grid-row: 1;
      }
      #root .visible {
        display: block;
      }

      #root.slide-down *,
      #root.slide-up *,
      #root.slide-left *,
      #root.slide-right * {
        display: block;
        opacity: 0;
        height: 0;
        transition-property: transform;
        transition-timing-function: linear;
        transition-duration: inherit;
        transform: translate(0, -110%);
      }
      #root.slide-up * {
        transform: translate(0, 110%);
      }
      #root.slide-left * {
        transform: translate(110%, 0);
      }
      #root.slide-right * {
        transform: translate(-110%, 0);
      }
      #root.slide-down .visible,
      #root.slide-up .visible,
      #root.slide-left .visible,
      #root.slide-right .visible {
        opacity: 1;
        height: auto;
        transform: translate(0%);
      }
      #root.slide-down .out,
      #root.slide-up .out,
      #root.slide-left .out,
      #root.slide-right .out {
        opacity: 1;
        height: auto;
        transform: translate(0, 110%);
      }
      #root.slide-up .out {
        transform: translate(0, -110%);
      }
      #root.slide-left .out {
        transform: translate(-110%);
      }
      #root.slide-right .out {
        transform: translate(110%);
      }

      #root.swap-down *,
      #root.swap-up *,
      #root.swap-left *,
      #root.swap-right * {
        display: block;
        opacity: 0;
        height: 0;
        transition-property: transform;
        transition-timing-function: linear;
        transition-duration: inherit;
        transform: translate(0, 110%);
      }
      #root.swap-up * {
        transform: translate(0, -110%);
      }
      #root.swap-left * {
        transform: translate(-110%, 0);
      }
      #root.swap-right * {
        transform: translate(110%, 0);
      }
      #root.swap-down .visible,
      #root.swap-up .visible,
      #root.swap-left .visible,
      #root.swap-right .visible {
        opacity: 1;
        height: auto;
        transition-delay: inherit;
        transform: translate(0%);
      }
      #root.swap-down .out,
      #root.swap-up .out,
      #root.swap-left .out,
      #root.swap-right .out {
        opacity: 1;
        height: auto;
      }

      #root.flip,
      #root.flip-x,
      #root.flip-y {
        width: 100%;
        height: 100%;
        position: relative;
        perspective: 1000px;
      }
      #root.flip *,
      #root.flip-x *,
      #root.flip-y * {
        display: block;
        opacity: 0;
        height: 0;
        transform: rotate3d(0, 1, 0, -180deg);
        transition-property: transform;
        transition-timing-function: linear;
        transition-duration: inherit;
        transform-style: preserve-3d;
        backface-visibility: hidden;
        z-index: 100;
      }
      #root.flip-y * {
        transform: rotate3d(1, 0, 0, -180deg);
      }
      #root.flip .visible,
      #root.flip-x .visible,
      #root.flip-y .visible {
        opacity: 1;
        height: auto;
        backface-visibility: hidden;
        transform: rotate3d(0, 0, 0, 0deg);
      }
      #root.flip .out,
      #root.flip-x .out,
      #root.flip-y .out {
        opacity: 1;
        height: auto;
        transform: rotate3d(0, 1, 0, 180deg);
      }
      #root.flip-y .out {
        transform: rotate3d(1, 0, 0, 180deg);
      }
    `;
  }
}

customElements.define("state-switch", StateSwitch as any);
