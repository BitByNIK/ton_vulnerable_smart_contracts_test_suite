import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type RaceConditionConfig = {};

export function raceConditionConfigToCell(config: RaceConditionConfig): Cell {
    return beginCell().endCell();
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
}
