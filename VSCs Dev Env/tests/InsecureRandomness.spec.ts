import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { InsecureRandomness } from '../wrappers/InsecureRandomness';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('InsecureRandomness', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('InsecureRandomness');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let insecureRandomness: SandboxContract<InsecureRandomness>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        insecureRandomness = blockchain.openContract(InsecureRandomness.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await insecureRandomness.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: insecureRandomness.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and insecureRandomness are ready to use
    });
});
