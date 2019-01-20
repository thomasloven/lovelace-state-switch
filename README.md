state-switch
============

Allows you to display different cards depending on the state of an entity, the currently logged in user or the current device-browser combination

This card requires [card-tools](https://github.com/thomasloven/lovelace-card-tools) to be installed.

![state-switch mov](https://user-images.githubusercontent.com/1299821/48923691-05479700-eeb1-11e8-8c8b-91ea14cfecf1.gif)

> Note in the animation above that the two browser windows have two different users logged in, which changes the rightmost card.

## Installation

Please read and follow this guide: [Lovelace Plugins](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins)

## Options

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:state-switch`
| entity | string | **Required** | Controlling entity id, `user` or `browser`
| states | object | **Required** | Map of states to cards to display
| default | string | none | State to use as default

The `entity` parameter can take three different types of value

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
