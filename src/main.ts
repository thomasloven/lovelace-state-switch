import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { deviceID } from "card-tools/src/deviceID";
import { hasTemplate } from "card-tools/src/templates";
import { bind_template, unbind_template } from "./templates";
import { HassObject, LovelaceCard, StateSwitchConfig } from "./types";
import pjson from "../package.json";

class StateSwitch extends LitElement {
  connectedWhileHidden = true;
  @property() _config: StateSwitchConfig;
  @property() _hass: HassObject;
  @property() state;
  @property() _tmpl;

  cardsInitialized = false;

  cards: Record<string, LovelaceCard>;
  _mqs: MediaQueryList[];

  async setConfig(config) {
    (window as any).deviceID = deviceID;
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
      for (const q in config.states) {
        const mq = window.matchMedia(q);
        mq.addEventListener("change", () => this.update_state());
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
    for (const k in this.cards) this.cards[k].hass = this._hass;
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
      this.cards[k].hass = this._hass;
    }
    this.cardsInitialized = true;
    this.update_state();
    this._updateVisibility();
  }

  update_state() {
    // skip state update when cards have not been fully initialized yet
    if (!this.cardsInitialized) {
      return;
    }

    let newstate = undefined;
    switch (this._config.entity) {
      case "template":
        newstate = this._tmpl;
        break;
      case "user":
        newstate = this._hass?.user?.name;
        break;
      case "group":
        newstate = this._hass?.user?.is_admin ? "admin" : "user";
        break;
      case "deviceID":
      case "browser":
        newstate = deviceID;
        break;
      case "hash":
        newstate = location.hash.substring(1);
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
        if (hasTemplate(this._config.entity)) {
          newstate = this._tmpl;
        } else {
          newstate = this._hass?.states[this._config.entity]?.state;
        }
    }

    if (newstate === undefined || !this.cards.hasOwnProperty(newstate))
      newstate = this._config.default;
    this.state = newstate;
  }

  set hass(hass) {
    this._hass = hass;
    for (const k in this.cards) this.cards[k].hass = hass;
  }

  _updateVisibility() {
    if (this.cards[this.state]) {
      this.classList.remove("no-match");
      this.style.setProperty("display", "");
      this.removeAttribute("hidden");
    } else {
      this.classList.add("no-match");
      this.style.setProperty("display", "none");
      this.setAttribute("hidden", "");
    }
    this.dispatchEvent(
      new Event("card-visibility-changed", { bubbles: true, cancelable: true })
    );
  }

  updated(changedProperties) {
    if (!changedProperties.has("state")) {
      this.update_state();
    } else {
      const oldState = changedProperties.get("state");
      if (this.cards[oldState]) {
        this.cards[oldState].parentElement.classList.remove("visible");
        if (this._config.transition) {
          this.shadowRoot.querySelector("#root").classList.add("transition");
          this.cards[oldState].parentElement.classList.add("out");
          window.setTimeout(() => {
            this.cards[oldState].parentElement.classList.remove("out");
            window.setTimeout(() => {
              this.shadowRoot
                .querySelector("#root")
                .classList.remove("transition");
            }, this._config.transition_time || 500);
          }, this._config.transition_time || 500);
        }
      }
      if (this.cards[this.state]) {
        this.cards[this.state].parentElement.classList.add("visible");
      }
      this._updateVisibility();
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
        ${Object.keys(this.cards).map(
          (k) => html` <div>${this.cards[k]}</div> `
        )}
      </div>
    `;
  }

  async getCardSize() {
    let sz = 1;
    for (const k in this.cards) {
      if (this.cards[k]?.getCardSize)
        sz = Math.max(sz, await this.cards[k].getCardSize());
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
        margin: -4px;
        padding: 4px;
        display: grid;
        grid-template-rows: auto 0px;
        overflow: clip visible;
      }
      #root.transition {
        overflow: hidden;
      }
      #root * {
        grid-column: 1;
        grid-row: 2;
        overflow: hidden;
        min-width: 0;
      }
      #root *.visible,
      #root *.out {
        grid-row: 1;
        overflow: visible;
      }

      #root.slide-down *,
      #root.slide-up *,
      #root.slide-left *,
      #root.slide-right * {
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
        transform: translate(0%);
      }
      #root.slide-down .out {
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
        transition-delay: inherit;
        transform: translate(0%);
      }

      #root.flip,
      #root.flip-x,
      #root.flip-y {
        position: relative;
        perspective: 1000px;
      }
      #root.flip *,
      #root.flip-x *,
      #root.flip-y * {
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
        backface-visibility: hidden;
        transform: rotate3d(0, 0, 0, 0deg);
      }
      #root.flip .out,
      #root.flip-x .out,
      #root.flip-y .out {
        pointer-events: none;
        transform: rotate3d(0, 1, 0, 180deg);
      }
      #root.flip-y .out {
        transform: rotate3d(1, 0, 0, 180deg);
      }
    `;
  }
}

if (!customElements.get("state-switch")) {
  customElements.define("state-switch", StateSwitch);
  console.info(
    `%cSTATE-SWITCH ${pjson.version} IS INSTALLED`,
    "color: green; font-weight: bold",
    ""
  );
}
