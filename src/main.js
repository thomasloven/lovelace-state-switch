import { LitElement, html } from "card-tools/src/lit-element";
import { hass } from "card-tools/src/hass";
import { createCard } from "card-tools/src/lovelace-element";
import { deviceID } from "card-tools/src/deviceID";

class StateSwitch extends LitElement {

  static get properties() {
    return {
      hass: {},
      state: {},
    };
  }

  setConfig(config) {
    this._config = config;

    this.state = undefined;
    this.cards = {};
    for(let k in config.states) {
      this.cards[k] = createCard(config.states[k]);
      this.cards[k].hass = hass();
    }

    if(config.entity === 'hash') {
      window.addEventListener("location-changed", () => this.updated(new Map()));
    }
  }

  update_state() {
    let newstate = undefined;
    switch(this._config.entity) {
      case "user":
        newstate = this.hass && this.hass.user && this.hass.user.name || undefined;
        break;
      case "group":
        newstate = (this.hass && this.hass.user && this.hass.user.is_admin) ? "admin" : "user";
      case "deviceID":
      case "browser":
        newstate = deviceID;
        break;
      case "hash":
        newstate = location.hash.substr(1);
        break;
      default:
        newstate = this.hass.states[this._config.entity];
        newstate = newstate ? newstate.state : undefined;
    }

    if (newstate === undefined || !this.cards.hasOwnProperty(newstate))
      newstate = this._config.default;
    this.state = newstate;
  }

  updated(changedProperties) {
    if(changedProperties.has("hass"))
      for(let k in this.cards)
        this.cards[k].hass = this.hass;

    if(!changedProperties.has("state")) {
      this.update_state();
    }
  }

  render() {
    return html`
    <div id="root">
      ${this.cards[this.state]}
    </div>
    `;
  }

  getCardSize() {
    let sz = 1;
    for(let k in this.cards) {
      if(this.cards[k] && this.cards[k].getCardSize)
        sz = Math.max(sz, this.cards[k].getCardSize());
    }
    return sz;
  }

}

customElements.define("state-switch", StateSwitch);
