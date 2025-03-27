import { toNano } from '@ton/core';
import { RaceCondition } from '../wrappers/RaceCondition';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const raceCondition = provider.open(RaceCondition.createFromConfig({}, await compile('RaceCondition')));

    await raceCondition.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(raceCondition.address);

    // run methods on `raceCondition`
}
