export interface StateSwitchConfig {
  entity: string;
  default?: string;
  states: Record<string, any>;

  transition: string;
  transition_time: number;
}

export interface LovelaceCard extends HTMLElement {
  hass: any;
  setConfig(config: any): void;
  getCardSize?(): number;
}

export interface HAState {
  entity_id: string;
  state: string;
  attributes?: Record<string, any>;
  last_changed: number;
  last_updated: number;
}

export interface HassObject {
  states: HAState[];
  user: {
    name: string;
    is_admin: boolean;
  };
  callWS: (_: any) => any;
}
