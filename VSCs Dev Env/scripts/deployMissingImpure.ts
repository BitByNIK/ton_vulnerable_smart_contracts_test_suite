import { toNano } from '@ton/core';
import { MissingImpure } from '../wrappers/MissingImpure';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const missingImpure = provider.open(MissingImpure.createFromConfig({}, await compile('MissingImpure')));

    await missingImpure.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(missingImpure.address);

    // run methods on `missingImpure`
}
