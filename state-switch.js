var LitElement = LitElement || Object.getPrototypeOf(customElements.get('hui-error-entity-row'));
class StateSwitch extends LitElement {

  setConfig(config) {
    this.config = config;

    this.cardSize = 1;
    this.cards = {}

    for(var k in this.config.states) {
      const conf = this.config.states[k];
      let tag = conf.type;
      tag = tag.startsWith("custom:")? tag.substr(7) : `hui-${tag}-card`;

      const card = this.cards[k] = document.createElement(tag);
      card.setConfig(conf);

      this.cardSize = Math.max(this.cardSize, card.getCardSize());
    }

    this.idCard = document.createElement("ha-card");
    this.idCard.innerHTML = `<h2>${window.cardTools.deviceID}</h2>`;
  }

  render() {
    return window.cardTools.litHtml`
    <div id="root">${this.currentCard}</div>
    `;
  }

  set hass(hass) {
    if(!hass) return;

    const lastCard = this.currentCard;
    if (this.config.entity === 'user') {
      this.currentCard = this.cards[hass.user.name] || this.cards[this.config.default];
    } else if(this.config.entity == 'browser') {
      this.currentCard = this.cards[window.cardTools.deviceID] || (this.config.default)?this.cards[this.config.default]:this.idCard;
    } else {
      let state = hass.states[this.config.entity];
      this.currentCard = ((state)?this.cards[state.state]:null) || this.cards[this.config.default];
    }

    if(this.currentCard != lastCard) this.requestUpdate();

    for(var k in this.cards)
      this.cards[k].hass = hass;
  }

  getCardSize() {
    return this.cardSize;
  }

}

customElements.define('state-switch', StateSwitch);
