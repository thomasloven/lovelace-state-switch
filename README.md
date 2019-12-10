state-switch
============
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)

Dynamically replace lovelace cards depending on occasion.

![state-switch mov](https://user-images.githubusercontent.com/1299821/48923691-05479700-eeb1-11e8-8c8b-91ea14cfecf1.gif)

> Note in the animation above that the two browser windows have two different users logged in, which changes the rightmost card.

For installation instructions [see this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

Install `state-switch.js` as a `module`.

```yaml
resources:
  - url: /local/state-switch.js
    type: module
```

## Usage

```yaml
type: custom:state-switch
entity: <entity>
default: <default>
states:
  <state 1>:
    <card 1>
  <state 2>:
    <card 2>
  ...
```

When the state of `<entity>` is `<state 1>`, `<card 1>` will be displayed, when it's `<state 2>`, `<card 2>` will be displayed.

If the state of `<entity>` doesn't match any `<state>`, the `<card>` for the `<default>` state will be displayed.

## Options
- `<entity>` **Required** An entity id or `hash`, `user`, `group`, `deviceID`
- `<default>` State to use as default fallback
- `<state N>` The state to match
- `<card N>` Lovelace card configuration

## State matching

### entity\_id
If the `entity` parameter is set to an entity id, which card is displayed will depend on the state of that entity.

```yaml
    cards:
      - type: entities
        entities:
          - input_select.home_mode
      - type: custom:state-switch
        entity: input_select.home_mode
        states:
          Home:
            type: vertical-stack
            cards:
              - type: entities
                title: Lights
                entities:
                  - light.bed_light
                  - light.ceiling_lights
                  - light.kitchen_lights
              - type: picture-glance
                camera_image: camera.demo_camera
                entities: []
          Away:
            type: alarm-panel
            entity: alarm_control_panel.alarm
          Guests:
            type: glance
            title: Lights
            entities:
              - light.bed_light
              - light.ceiling_lights
              - light.kitchen_lights
```

Note that the words `on` and `off` are magic in yaml, so if the entity is e.g. a switch, you need to quote the keys in the `states:` mapping:

```yaml
        states:
          "on":
            type: markdown
            content:>
              Light is on
          "off":
            type: markdown
            content:>
              Light is off
```

### hash
If the `entity` parameter is set to `hash`, which card is displayed will depend on the "hash" part of the current URL - i.e. whatever comes after an optional `#` symbol in the current page URL.

This allows for controlling the view on a browser-window to browser-window basis, and without needing a controlling entity.

```yaml
    cards:
      - type: horizontal-stack
        cards:
          - type: entity-button
            entity: light.my_dummy
            tap_action:
              action: navigate
              navigation_path: "#p1"
          - type: entity-button
            entity: light.my_dummy
            tap_action:
              action: navigate
              navigation_path: "#p2"
          - type: entity-button
            entity: light.my_dummy
            tap_action:
              action: navigate
              navigation_path: "#p2"
      - type: custom:state-switch
        entity: hash
        default: p1
        states:
          p1:
            type: markdown
            content: |
              # Page 1
          p2:
            type: markdown
            content: |
              # Page 2
          p3:
            type: markdown
            content: |
              # Page 3
```

### user
If the `entity` parameter is set to `user`, which card is displayed will depend on the currently logged in users username.

```yaml
    cards:
      - type: custom:state-switch
        entity: user
        default: default
        states:
          A:
            type: entities
            title: User A stuff
            entities:
              - light.bed_light
              - light.ceiling_lights
              - light.kitchen_lights
          B:
            type: glance
            title: User B stuff
            entities:
              - light.bed_light
              - light.ceiling_lights
              - light.kitchen_lights
          default:
            type: markdown
            content: >
              ## Unknown user
```

### group
`group` can take one of two values - `admin` or `user` depending on whether the currently logged in user is in the `Administrators` group or not.

### deviceID
If the `entity` parameter is set to `deviceID`, which card is displayed will depend on the device-browser combination which is currently displaying the page.

See [browser_mod](https://github.com/thomasloven/hass-browser_mod#devices) for a description on how deviceIDs work.

```yaml
      - type: custom:state-switch
        entity: deviceID
        states:
          '9c2aaf6f-ed26e3c1':
            type: markdown
            content: >
              Desktop
          'c8a4981c-d69c5e3c':
            type: markdown
            content: >
              Mobile
```

## A few tips

- To replace more than one card at a time, use e.g. [`vertical-stack`](https://www.home-assistant.io/lovelace/vertical-stack/), [`horizontal-stack`](https://www.home-assistant.io/lovelace/horizontal-stack/) or [`layout-card`](https://github.com/thomasloven/lovelace-layout-card).

---
<a href="https://www.buymeacoffee.com/uqD6KHCdJ" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
