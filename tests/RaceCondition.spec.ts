import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { RaceCondition } from '../wrappers/RaceCondition';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('RaceCondition', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('RaceCondition');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let raceCondition: SandboxContract<RaceCondition>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        raceCondition = blockchain.openContract(RaceCondition.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await raceCondition.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: raceCondition.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and raceCondition are ready to use
    });
});
