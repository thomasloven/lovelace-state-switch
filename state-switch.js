const t=customElements.get("home-assistant-main")?Object.getPrototypeOf(customElements.get("home-assistant-main")):Object.getPrototypeOf(customElements.get("hui-view")),e=t.prototype.html,s=t.prototype.css;function i(){return document.querySelector("hc-main")?document.querySelector("hc-main").hass:document.querySelector("home-assistant")?document.querySelector("home-assistant").hass:void 0}function a(t,e,s=null){if((t=new Event(t,{bubbles:!0,cancelable:!1,composed:!0})).detail=e||{},s)s.dispatchEvent(t);else{var i=function(){var t=document.querySelector("hc-main");return t?(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("hc-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-view")||t.querySelector("hui-panel-view"):(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=document.querySelector("home-assistant"))&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root"))&&t.shadowRoot)&&t.querySelector("ha-app-layout"))&&t.querySelector("#view"))&&t.firstElementChild}();i&&i.dispatchEvent(t)}}let o=window.cardHelpers;const r=new Promise((async(t,e)=>{o&&t();const s=async()=>{o=await window.loadCardHelpers(),window.cardHelpers=o,t()};window.loadCardHelpers?s():window.addEventListener("load",(async()=>{!async function(){if(customElements.get("hui-view"))return!0;await customElements.whenDefined("partial-panel-resolver");const t=document.createElement("partial-panel-resolver");if(t.hass={panels:[{url_path:"tmp",component_name:"lovelace"}]},t._updateRoutes(),await t.routerOptions.routes.tmp.load(),!customElements.get("ha-panel-lovelace"))return!1;const e=document.createElement("ha-panel-lovelace");e.hass=i(),void 0===e.hass&&(await new Promise((t=>{window.addEventListener("connection-status",(e=>{console.log(e),t()}),{once:!0})})),e.hass=i()),e.panel={config:{mode:null}},e._fetchConfig()}(),window.loadCardHelpers&&s()}))}));function n(t,e){const s={type:"error",error:t,origConfig:e},i=document.createElement("hui-error-card");return customElements.whenDefined("hui-error-card").then((()=>{const t=document.createElement("hui-error-card");t.setConfig(s),i.parentElement&&i.parentElement.replaceChild(t,i)})),r.then((()=>{a("ll-rebuild",{},i)})),i}function l(t,e){if(!e||"object"!=typeof e||!e.type)return n(`No ${t} type configured`,e);let s=e.type;if(s=s.startsWith("custom:")?s.substr("custom:".length):`hui-${s}-${t}`,customElements.get(s))return function(t,e){let s=document.createElement(t);try{s.setConfig(JSON.parse(JSON.stringify(e)))}catch(t){s=n(t,e)}return r.then((()=>{a("ll-rebuild",{},s)})),s}(s,e);const i=n(`Custom element doesn't exist: ${s}.`,e);i.style.display="None";const o=setTimeout((()=>{i.style.display=""}),2e3);return customElements.whenDefined(s).then((()=>{clearTimeout(o),a("ll-rebuild",{},i)})),i}function c(t){return o?o.createCardElement(t):l("card",t)}const d="lovelace-player-device-id";function h(){if(!localStorage[d]){const t=()=>Math.floor(1e5*(1+Math.random())).toString(16).substring(1);window.fully&&"function"==typeof fully.getDeviceId?localStorage[d]=fully.getDeviceId():localStorage[d]=`${t()}${t()}-${t()}${t()}`}return localStorage[d]}let u=h();const m=new URLSearchParams(window.location.search);var p;m.get("deviceID")&&null!==(p=m.get("deviceID"))&&("clear"===p?localStorage.removeItem(d):localStorage[d]=p,u=h());customElements.define("state-switch",class extends t{static get properties(){return{hass:{},state:{}}}setConfig(t){this._config=t,console.log(t),this.state=void 0,this.classList.add("no-match"),this.cards={};for(let e in t.states)this.cards[e]=c(t.states[e]),this.cards[e].hass=i();if("hash"===t.entity&&window.addEventListener("location-changed",(()=>this.updated(new Map))),"mediaquery"===t.entity)for(const t in this.cards)window.matchMedia(t).addListener(this.update_state.bind(this));if("template"===t.entity){const e=t.template;String(e).includes("{%")||String(e).includes("{{")?function(t,e,s,a=!0){t||(t=i().connection);let o={user:i().user.name,browser:u,hash:location.hash.substr(1)||" ",...s.variables},r=s.template,n=s.entity_ids;t.subscribeMessage((t=>{if(a){let s=String(t.result);const a=/_\([^)]*\)/g;s=s.replace(a,(t=>i().localize(t.substring(2,t.length-1))||t)),e(s)}else e(t.result)}),{type:"render_template",template:r,variables:o,entity_ids:n})}(null,(t=>{this._tmpl=t,this.update_state()}),{template:e,variables:{config:t},entity_ids:t.entity_ids}):this._tmpl=e}}update_state(){let t;switch(this._config.entity){case"template":t=this._tmpl;break;case"user":t=this.hass&&this.hass.user&&this.hass.user.name||void 0;break;case"group":t=this.hass&&this.hass.user&&this.hass.user.is_admin?"admin":"user";break;case"deviceID":case"browser":t=u;break;case"hash":t=location.hash.substr(1);break;case"mediaquery":for(const e in this.cards)if(window.matchMedia(e).matches){t=e;break}break;default:t=this.hass.states[this._config.entity],t=t?t.state:void 0}void 0!==t&&this.cards.hasOwnProperty(t)||(t=this._config.default),this.state=t}updated(t){if(t.has("hass"))for(let t in this.cards)this.cards[t].hass=this.hass;if(t.has("state")){const e=t.get("state");this.cards[e]&&(this.cards[e].classList.remove("visible"),this.cards[e].classList.add("out"),window.setTimeout((()=>{this.cards[e].classList.remove("out")}),this._config.transition_time||500)),this.cards[this.state]?(this.cards[this.state].classList.add("visible"),this.classList.remove("no-match")):this.classList.add("no-match")}else this.update_state()}render(){return e`
      <div
        id="root"
        class="${this._config.transition}"
        style="
        transition-duration: ${this._config.transition_time||500}ms;
        transition-delay: ${this._config.transition_time||500}ms;
        "
      >
        ${Object.keys(this.cards).map((t=>e` ${this.cards[t]} `))}
      </div>
    `}getCardSize(){let t=1;for(let e in this.cards)this.cards[e]&&this.cards[e].getCardSize&&(t=Math.max(t,this.cards[e].getCardSize()));return t}static get styles(){return s`
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
    `}});
