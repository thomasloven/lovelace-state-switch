# state-switch

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
transition: <transition>
transition_time: <transition_time>
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

- `<entity>` **Required** An entity id or `hash`, `user`, `group`, `deviceID`, `mediaquery`
- `<default>` State to use as default fallback
- `<state N>` The state to match
- `<card N>` Lovelace card configuration
- `<transition>` Animated transition to use (`slide-left`, `slide-right`, `swap-left`, `swap_right` or `flip`). Default: `none`
- `<transition_time>` The time for an animated transition in ms. Default: 500

## State matching

### entity_id

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

If the `entity` parameter is set to `user`, which card is displayed will depend on the currently logged in users Display Name.

```yaml
type: custom:state-switch
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
type: custom:state-switch
entity: deviceID
states:
  "9c2aaf6f-ed26e3c1":
    type: markdown
    content: >
      Desktop
  "c8a4981c-d69c5e3c":
    type: markdown
    content: >
      Mobile
```

### mediaquery

If the `entity` parameter is set to `mediaquery`, the card that is displays will be the first one that matches a [CSS @media rule](https://www.w3schools.com/cssref/css3_pr_mediaquery.asp).

![Skärminspelning 2019-12-10 kl  21 18 12 mov](https://user-images.githubusercontent.com/1299821/70567314-028c1280-1b96-11ea-87d9-230387c75bc4.gif)

```yaml
type: custom:state-switch
entity: mediaquery
states:
  "(min-width: 1000px)":
    type: markdown
    content: more than 1000 px
  "(min-width: 500px)":
    type: markdown
    content: 500 to 1000 px
  "all":
    type: markdown
    content: "Really small"
```

### template

If the `entity` parameter is a string that contains a [jinja template](https://www.home-assistant.io/docs/configuration/templating/), the card that is displayed will be the one that matches the templates result.

```yaml
type: custom:state-switch
entity: "{% if is_state('switch.night_mode', 'on') and now().weekday() < 5 %} day {% else %} night {% endif %}"
states:
  day:
    type: markdown
    content: Where do you want to go today?
  night:
    type: markdown
    content: Sleep tight!
```

> Note: Jinja2 templating is not cheap. Avoid it for simple things that can be solved with just an entity.

## Transitions

The switch from one card to another can be animated by setting the `<transition>` option.
The speed of the transition is set by `<transition_time>` (milliseconds). Note that some animations do two things, and thus take two times `<transition_time>` to complete.

Available transitions are:

- `slide-down`
- `slide-up`
- `slide-left`
- `slide-right`
- `swap-down`
- `swap-up`
- `swap-left`
- `swap-right`
- `flip-x`
- `flip-y`

![jVbI15cMvT](https://user-images.githubusercontent.com/1299821/70644405-396c3200-1c43-11ea-95cb-c6ffa0b818f8.gif)

## A few tips

- To replace more than one card at a time, use e.g. [`vertical-stack`](https://www.home-assistant.io/lovelace/vertical-stack/), [`horizontal-stack`](https://www.home-assistant.io/lovelace/horizontal-stack/) or [`layout-card`](https://github.com/thomasloven/lovelace-layout-card).

---

<a href="https://www.buymeacoffee.com/uqD6KHCdJ" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
