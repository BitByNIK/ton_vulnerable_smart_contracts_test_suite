import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { AuctionDelayed } from '../wrappers/AuctionDelayed';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('AuctionDelayed', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('AuctionDelayed');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let auctionDelayed: SandboxContract<AuctionDelayed>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        auctionDelayed = blockchain.openContract(AuctionDelayed.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await auctionDelayed.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: auctionDelayed.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and auctionDelayed are ready to use
    });
});
