customElements.whenDefined('card-tools').then(() => {
class StateSwitch extends cardTools.litElement() {

  setConfig(config) {
    cardTools.checkVersion(0.3);
    this.config = config;

    this.cardSize = 1;
    this.cards = {}

    for(var k in this.config.states) {
      this.cards[k] = cardTools.createCard(this.config.states[k]);
      this.cardSize = Math.max(this.cardSize, this.cards[k].getCardSize());
    }

    this.idCard = cardTools.createCard({
      type: "markdown",
      title: "Device ID",
      content: `Your device id is: \`${cardTools.deviceID()}\``,
    });
  }

  render() {
    return cardTools.litHtml()`
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
      this.currentCard = this.cards[cardTools.deviceID]
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
});

setTimeout(() => {
  if(customElements.get('card-tools')) return;
  customElements.define('state-switch', class extends HTMLElement{
    setConfig() { throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");}
  });
}, 2000);
