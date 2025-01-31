import { toNano } from '@ton/core';
import { AuctionDelayed } from '../wrappers/AuctionDelayed';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const auctionDelayed = provider.open(AuctionDelayed.createFromConfig({}, await compile('AuctionDelayed')));

    await auctionDelayed.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(auctionDelayed.address);

    // run methods on `auctionDelayed`
}
