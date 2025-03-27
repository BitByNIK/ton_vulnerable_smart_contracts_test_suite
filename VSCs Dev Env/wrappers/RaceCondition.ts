import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode, TupleItemInt } from '@ton/core';

export type RaceConditionConfig = {
    total_balance: bigint;
    accounts: Dictionary<bigint, bigint>;
};

export function raceConditionConfigToCell(config: RaceConditionConfig): Cell {
    return beginCell().storeCoins(config.total_balance).storeDict(config.accounts).endCell();
}

export class RaceCondition implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new RaceCondition(address);
    }

    static createFromConfig(config: RaceConditionConfig, code: Cell, workchain = 0) {
        const data = raceConditionConfigToCell(config);
        const init = { code, data };
        return new RaceCondition(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendDeposit(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x00, 32).endCell(),
        });
    }

    async sendWithdraw(provider: ContractProvider, via: Sender, value: bigint, withdraw_amount: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x01, 32).storeCoins(withdraw_amount).endCell(),
        });
    }

    async getUserBalance(provider: ContractProvider, address: bigint) {
        const addressSlice: TupleItemInt = {
            type: 'int',
            value: address,
        };
        const result = await provider.get('get_user_balance', [addressSlice]);
        return result.stack.readBigNumber();
    }

    async getTotalBalance(provider: ContractProvider) {
        const result = await provider.get('get_total_balance', []);
        return result.stack.readBigNumber();
    }
}
