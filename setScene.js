const connectWithGateway = require('./connectWithGateway');

function delay(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

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

function waitForGroupUpdate(tradfri, mills, fn) {
    return new Promise((resolve, reject) => {
        setTimeout(reject, mills);

        tradfri.on("group updated", function handler(updatedGroup) {
            if (fn(updatedGroup)) {
                tradfri.removeListener("group updated", handler);
                resolve();
            }
        });
    });
}

async function setGroupToScene(tradfri, group, scene, retries) {
    console.log('Setting ' + group.name + ' to ' + scene.name);

    await tradfri.operateGroup(group, {
        onOff: true,
        transitionTime: 240,
        sceneId: scene.instanceId,
    }, true);

    let failed = false;
    await waitForGroupUpdate(tradfri, 5000, (updatedGroup) => {
        const scenes = tradfri.groups[updatedGroup.instanceId].scenes;
        console.log(updatedGroup.name
            + ' is ' + (updatedGroup.onOff ? 'on' : 'off')
            + ' with scene ' + scenes[updatedGroup.sceneId].name);

        return updatedGroup.instanceId === group.instanceId
            && updatedGroup.onOff === true
            && updatedGroup.sceneId === scene.instanceId;
    }).catch(() => {
        failed = true;
    });

    if (failed && retries > 0) {
        await setGroupToScene(tradfri, group, scene, retries - 1);
    }
}

async function setScene(sceneName, turnOn) {
    const tradfri = await connectWithGateway();

    await tradfri.observeDevices();
    await tradfri.observeGroupsAndScenes();

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
            await setGroupToScene(tradfri, group, scene, 3);
        }
    }

    tradfri.destroy();
}

module.exports = setScene;
