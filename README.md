state-switch
============

![state-switch mov](https://user-images.githubusercontent.com/1299821/48923691-05479700-eeb1-11e8-8c8b-91ea14cfecf1.gif)


```yaml
  - title: state-switch-card
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
