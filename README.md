# tradfri-automation
Home automation utilities for tradfri

# Commands

## Turn Off

`./turnOff <name>`

Turn Off groups and lights that match the regex name.

## Scene

`./scene <name>`

Set one or more groups to the scene that matches the regex name. If multiple
scenes match the regex then one of the scenes will be selected at random.

## Watch TV

`./watchtv`

Monitors UPnP to observe when a TV is turned on or off, and sets the lights
to a specified group. If the lights are off then the scene is not set.

# Set Up

The following scenes are created in the relevant groups:

- Evening, enabled by cron at dusk
- Night, enabled by cron at 11pm
- Daytime, enabled by cron at dawn
- Tv On, scene set by watchtv
- Tv Off, scene set by watchtv
