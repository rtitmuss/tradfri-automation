const connectWithGateway = require('./connectWithGateway');

function randomElement(items) {
    return items[Math.floor(Math.random()*items.length)];
}

function isLightInGroupOn(group, devices) {
    const deviceIds = group.deviceIDs;
    for (let i = 0; i < deviceIds.length; i++) {
        const deviceId = deviceIds[i];
        if (devices[deviceId].lightList === undefined) {
            continue;
        }

        const anyLightOn = devices[deviceId].lightList
            .reduce((acc, light) => acc || light.onOff, false);

        if (anyLightOn) {
            return true;
        }
    }
    return false;
}

async function setScene(sceneName, turnOn) {
    const tradfri = await connectWithGateway();

    await tradfri.observeDevices();
    await tradfri.observeGroupsAndScenes();

    tradfri.stopObservingDevices();
    tradfri.stopObservingGroups();

    const devices = tradfri.devices;

    const regex = new RegExp(sceneName, 'i');

    for (let groupInfo of Object.values(tradfri.groups)) {
        const group = groupInfo.group;
        const scenes = Object.values(groupInfo.scenes);

        const filteredScenes = scenes.filter(scene => scene.name.search(regex) !== -1);
        if (filteredScenes.length === 0) {
            continue;
        }

        const scene = randomElement(filteredScenes);

        if (turnOn || isLightInGroupOn(group, devices)) {
            console.log(group.name + ' ON to ' + scene.name);

            await tradfri.operateGroup(group, {
                onOff: true,
                transitionTime: 240,
                sceneId: scene.instanceId,
            });
        }
    }

    tradfri.destroy();
}

module.exports = setScene;
