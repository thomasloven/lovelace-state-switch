!function(t){var e={};function s(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)s.d(i,r,function(e){return t[e]}.bind(null,r));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=0)}([function(t,e,s){"use strict";s.r(e);const i=customElements.get("home-assistant-main")?Object.getPrototypeOf(customElements.get("home-assistant-main")):Object.getPrototypeOf(customElements.get("hui-view")),r=i.prototype.html,o=i.prototype.css;function a(){return document.querySelector("hc-main")?document.querySelector("hc-main").hass:document.querySelector("home-assistant")?document.querySelector("home-assistant").hass:void 0}function n(t,e,s=null){if((t=new Event(t,{bubbles:!0,cancelable:!1,composed:!0})).detail=e||{},s)s.dispatchEvent(t);else{var i=function(){var t=document.querySelector("hc-main");return t=t?(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("hc-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-view"):(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=document.querySelector("home-assistant"))&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root"))&&t.shadowRoot)&&t.querySelector("ha-app-layout #view"))&&t.firstElementChild}();i&&i.dispatchEvent(t)}}let l=window.cardHelpers;const c=new Promise(async(t,e)=>{l&&t();const s=async()=>{l=await window.loadCardHelpers(),window.cardHelpers=l,t()};window.loadCardHelpers?s():window.addEventListener("load",async()=>{!function(){if(customElements.get("hui-view"))return!0;const t=document.createElement("partial-panel-resolver");if(t.hass=a(),!t.hass||!t.hass.panels)return!1;t.route={path:"/lovelace/"},t._updateRoutes();try{document.querySelector("home-assistant").appendChild(t)}catch(t){}finally{document.querySelector("home-assistant").removeChild(t)}customElements.get("hui-view")}(),window.loadCardHelpers&&s()})});function d(t,e){const s=document.createElement("hui-error-card");return s.setConfig({type:"error",error:t,origConfig:e}),c.then(()=>{n("ll-rebuild",{},s)}),s}function u(t,e){if(!e||"object"!=typeof e||!e.type)return d(`No ${t} type configured`,e);let s=e.type;if(s=s.startsWith("custom:")?s.substr("custom:".length):`hui-${s}-${t}`,customElements.get(s))return function(t,e){let s=document.createElement(t);try{s.setConfig(JSON.parse(JSON.stringify(e)))}catch(t){s=d(t,e)}return c.then(()=>{n("ll-rebuild",{},s)}),s}(s,e);const i=d(`Custom element doesn't exist: ${s}.`,e);i.style.display="None";const r=setTimeout(()=>{i.style.display=""},2e3);return customElements.whenDefined(s).then(()=>{clearTimeout(r),n("ll-rebuild",{},i)}),i}function h(t){return l?l.createCardElement(t):u("card",t)}let p=function(){if(window.fully&&"function"==typeof fully.getDeviceId)return fully.getDeviceId();if(!localStorage["lovelace-player-device-id"]){const t=()=>Math.floor(1e5*(1+Math.random())).toString(16).substring(1);localStorage["lovelace-player-device-id"]=`${t()}${t()}-${t()}${t()}`}return localStorage["lovelace-player-device-id"]}();customElements.define("state-switch",class extends i{static get properties(){return{hass:{},state:{}}}setConfig(t){this._config=t,this.state=void 0,this.cards={};for(let e in t.states)this.cards[e]=h(t.states[e]),this.cards[e].hass=a();if("hash"===t.entity&&window.addEventListener("location-changed",()=>this.updated(new Map)),"mediaquery"===t.entity)for(const t in this.cards)window.matchMedia(t).addListener(this.update_state.bind(this));if("template"===t.entity){const e=t.template;String(e).includes("{%")||String(e).includes("{{")?function(t,e,s){t||(t=a().connection);let i={user:a().user.name,browser:p,hash:location.hash.substr(1)||" ",...s.variables},r=s.template,o=s.entity_ids;t.subscribeMessage(t=>{let s=t.result;s=s.replace(/_\([^)]*\)/g,t=>a().localize(t.substring(2,t.length-1))||t),e(s)},{type:"render_template",template:r,variables:i,entity_ids:o})}(null,t=>{this._tmpl=t,this.update_state()},{template:e,variables:{config:t},entity_ids:t.entity_ids}):this._tmpl=e}}update_state(){let t=void 0;switch(this._config.entity){case"template":t=this._tmpl;break;case"user":t=this.hass&&this.hass.user&&this.hass.user.name||void 0;break;case"group":t=this.hass&&this.hass.user&&this.hass.user.is_admin?"admin":"user";case"deviceID":case"browser":t=p;break;case"hash":t=location.hash.substr(1);break;case"mediaquery":for(const e in this.cards)if(window.matchMedia(e).matches){t=e;break}break;default:t=this.hass.states[this._config.entity],t=t?t.state:void 0}void 0!==t&&this.cards.hasOwnProperty(t)||(t=this._config.default),this.state=t}updated(t){if(t.has("hass"))for(let t in this.cards)this.cards[t].hass=this.hass;if(t.has("state")){const e=t.get("state");this.cards[e]&&(this.cards[e].classList.remove("visible"),this.cards[e].classList.add("out"),window.setTimeout(()=>{this.cards[e].classList.remove("out")},this._config.transition_time||500)),this.cards[this.state]?(this.cards[this.state].classList.add("visible"),this.classList.remove("no-match")):this.classList.add("no-match")}else this.update_state()}render(){return r`
    <div
      id="root"
      class="${this._config.transition}"
      style="
        transition-duration: ${this._config.transition_time||500}ms;
        transition-delay: ${this._config.transition_time||500}ms;
        "
    >
      ${Object.keys(this.cards).map(t=>r`
          ${this.cards[t]}
        `)}
    </div>
    `}getCardSize(){let t=1;for(let e in this.cards)this.cards[e]&&this.cards[e].getCardSize&&(t=Math.max(t,this.cards[e].getCardSize()));return t}static get styles(){return o`
      :host {
        perspective: 1000px;
      }
      :host(.no-match) {
        display: none;
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
      #root.swap-left *{
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
    `}})}]);