import { toNano } from '@ton/core';
import { AsynDex } from '../wrappers/AsynDex';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const asynDex = provider.open(AsynDex.createFromConfig({}, await compile('AsynDex')));

    await asynDex.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(asynDex.address);

    // run methods on `asynDex`
}
