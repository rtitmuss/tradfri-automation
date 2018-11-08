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

## Complementary

`./complementary`

Follow a RGB light, setting another light automatically with complementary colors.

# Set Up

The following scenes are created in the relevant groups:

- Evening, enabled by cron at dusk
- Night, enabled by cron at 11pm
- Daytime, enabled by cron at dawn
- Tv On, scene set by watchtv
- Tv Off, scene set by watchtv

# Configuration

On the Rasberry Pi run these commands to enable the watchtv script to run as a service

sudo cp etc/watchtv.service /etc/systemd/system
sudo systemctl enable watchtv
sudo systemctl start watchtv

# Cron

Use the following cron configuration:

# turn off all lights an hour after sunrise
0 2 * * * /usr/local/bin/sunwait sun up +1:00:00 59.329N, 18.068E; /home/pi/tradfri-automation/turnoff

# turn on evening scene half an hour before sunset
0 12 * * * /usr/local/bin/sunwait sun down -0:30:00 59.329N, 18.068E; /home/pi/tradfri-automation/scene evening

# set night scene at 11pm
0 23 * * * /home/pi/tradfri-automation/scene night

