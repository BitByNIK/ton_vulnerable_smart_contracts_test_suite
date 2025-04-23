import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MissingImpureConfig = {};

export function missingImpureConfigToCell(config: MissingImpureConfig): Cell {
    return beginCell().endCell();
}

export class MissingImpure implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new MissingImpure(address);
    }

    static createFromConfig(config: MissingImpureConfig, code: Cell, workchain = 0) {
        const data = missingImpureConfigToCell(config);
        const init = { code, data };
        return new MissingImpure(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
