import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type AsynDexConfig = {};

export function asynDexConfigToCell(config: AsynDexConfig): Cell {
    return beginCell().endCell();
}

export class AsynDex implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new AsynDex(address);
    }

    static createFromConfig(config: AsynDexConfig, code: Cell, workchain = 0) {
        const data = asynDexConfigToCell(config);
        const init = { code, data };
        return new AsynDex(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
