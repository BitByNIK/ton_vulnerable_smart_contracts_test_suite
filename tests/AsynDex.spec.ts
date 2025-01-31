import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { AsynDex } from '../wrappers/AsynDex';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('AsynDex', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('AsynDex');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let asynDex: SandboxContract<AsynDex>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        asynDex = blockchain.openContract(AsynDex.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await asynDex.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: asynDex.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and asynDex are ready to use
    });
});
