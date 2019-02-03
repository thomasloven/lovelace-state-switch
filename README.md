state-switch
============

Allows you to display different cards depending on the state of an entity, the currently logged in user or the current device-browser combination

![state-switch mov](https://user-images.githubusercontent.com/1299821/48923691-05479700-eeb1-11e8-8c8b-91ea14cfecf1.gif)

> Note in the animation above that the two browser windows have two different users logged in, which changes the rightmost card.

## Installation
This card requires [card-tools](https://github.com/thomasloven/lovelace-card-tools) to be installed.

For installation instructions [see this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

## Options

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:state-switch`
| entity | string | **Required** | Controlling entity id, `hash`, `user` or `browser`
| states | object | **Required** | Map of states to cards to display
| default | string | none | State to use as default

The `entity` parameter can take four different types of value

### Entity\_id
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

### browser
If the `entity` parameter is set to `browser`, which card is displayed will depend on the device-browser combination which is currently displaying the page.

This "browser ID" is in the form of a 16 character string with a dash in the middle and is unique, random and persistent for the browser.

If the `default` parameter is **not** set, the default behavior will be to display a small card containing the browser ID.

```yaml
      - type: custom:state-switch
        entity: browser
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
