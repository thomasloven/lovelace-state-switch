var LitElement = LitElement || Object.getPrototypeOf(customElements.get('hui-error-entity-row'));
class StateSwitch extends LitElement {

  setConfig(config) {
    this.config = config;

    this.cardSize = 1;
    this.cards = {}

    for(var k in this.config.states) {
      this.cards[k] = window.cardTools.createCard(this.config.states[k]);
      this.cardSize = Math.max(this.cardSize, this.cards[k].getCardSize());
    }

    this.idCard = window.cardTools.createCard({
      type: "markdown",
      title: "Device ID",
      content: `Your device id is: \`${window.cardTools.deviceID}\``,
    });
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
      this.currentCard = this.cards[hass.user.name]
        || this.cards[this.config.default];
    } else if(this.config.entity == 'browser') {
      this.currentCard = this.cards[window.cardTools.deviceID]
        || ((this.config.default)
          ? this.cards[this.config.default]
          : this.idCard);
    } else {
      let state = hass.states[this.config.entity];
      this.currentCard = ((state)?this.cards[state.state]:null)
        || this.cards[this.config.default];
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
