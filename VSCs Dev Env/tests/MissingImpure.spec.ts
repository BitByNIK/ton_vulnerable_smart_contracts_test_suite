import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { MissingImpure } from '../wrappers/MissingImpure';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('MissingImpure', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('MissingImpure');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let missingImpure: SandboxContract<MissingImpure>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        missingImpure = blockchain.openContract(MissingImpure.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await missingImpure.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: missingImpure.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and missingImpure are ready to use
    });
});
