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
      } else {
        this.classList.add("no-match");
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
        overflow-x: hidden;
        xborder: 1px solid red;
      }
      #root * {
        display: none;
      }
      #root .visible {
        display: block;
      }

      #root.slide-right,
      #root.slide-left {
        display: grid;
      }
      #root.slide-right *,
      #root.slide-left * {
        grid-column: 1;
        grid-row: 1;
        display: block;
        opacity: 0;
        height: 0;
        transition-property: transform;
        transition-timing-function: linear;
        transition-duration: inherit;
        transform: translate(-110%);
      }
      #root.slide-left * {
        transform: translate(110%);
      }
      #root.slide-right .visible,
      #root.slide-left .visible {
        opacity: 1;
        height: auto;
        transform: translate(0%);
      }
      #root.slide-right .out,
      #root.slide-left .out {
        opacity: 1;
        height: auto;
        transform: translate(110%);
      }
      #root.slide-left .out {
        transform: translate(-110%);
      }

      #root.swap-right,
      #root.swap-left {
        display: grid;
      }
      #root.swap-right *,
      #root.swap-left * {
        grid-column: 1;
        grid-row: 1;
        display: block;
        opacity: 0;
        height: 0;
        transition-property: transform;
        transition-timing-function: linear;
        transition-duration: inherit;
        transform: translate(110%);
      }
      #root.swap-left * {
        transform: translate(-110%);
      }
      #root.swap-right .visible,
      #root.swap-left .visible {
        opacity: 1;
        height: auto;
        transition-delay: inherit;
        transform: translate(0%);
      }
      #root.swap-right .out,
      #root.swap-left .out {
        opacity: 1;
        height: auto;
      }

      #root.flip {
        display: grid;
        width: 100%;
        height: 100%;
        position: relative;
      }
      #root.flip * {
        grid-column: 1;
        grid-row: 1;
        display: block;
        opacity: 0;
        height: 0;
        transform: rotateY(-180deg);
        transition-property: transform;
        transition-timing-function: linear;
        transition-duration: inherit;
        transform-style: preserve-3d;
        backface-visibility: hidden;
        z-index: 100;
      }
      #root.flip .visible {
        opacity: 1;
        height: auto;
        backface-visibility: hidden;
        transform: rotateY(0deg);
      }
      #root.flip .out {
        opacity: 1;
        height: auto;
        transform: rotateY(180deg);
      }
    `;
  }
}

customElements.define("state-switch", StateSwitch as any);

// Monkey patch hui-view to avoid scroll bars in columns
/*customElements.whenDefined("hui-view").then( () => {
const HuiView = customElements.get("hui-view").prototype;
const oldRenderStyles = HuiView.renderStyles;
HuiView.renderStyles = function() {
  let original = oldRenderStyles();
  original.strings = [original.strings[0] + `
  <style>
    .column {
      overflow-y: hidden;
    }
  </style>
  `];
  return original;
}
fireEvent('ll-rebuild', {});
});*/
