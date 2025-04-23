import { toNano } from '@ton/core';
import { InsecureRandomness } from '../wrappers/InsecureRandomness';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const insecureRandomness = provider.open(InsecureRandomness.createFromConfig({}, await compile('InsecureRandomness')));

    await insecureRandomness.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(insecureRandomness.address);

    // run methods on `insecureRandomness`
}
