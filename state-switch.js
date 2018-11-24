class StateSwitch extends Polymer.Element{

  setConfig(config) {
    this.config = config;

    this.root = document.createElement('div');
    this.appendChild(this.root);

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
  }

  set hass(hass) {
    if(!hass) return;

    const lastCard = this.currentCard;
    if (this.config.entity === 'user') {
      this.currentCard = this.cards[hass.user.name] || this.cards[this.config.default];
    } else {
      let state = hass.states[this.config.entity];
      this.currentCard = ((state)?this.cards[state.state]:null) || this.cards[this.config.default];
    }

    if(this.currentCard != lastCard) {
      while(this.root.firstChild) this.root.removeChild(this.root.firstChild);
      this.root.appendChild(this.currentCard);
    }

    for(var k in this.cards)
      this.cards[k].hass = hass;
  }

  getCardSize() {
    return this.cardSize;
  }

}

customElements.define('state-switch', StateSwitch);
