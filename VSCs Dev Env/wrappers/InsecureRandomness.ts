import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type InsecureRandomnessConfig = {};

export function insecureRandomnessConfigToCell(config: InsecureRandomnessConfig): Cell {
    return beginCell().endCell();
}

export class InsecureRandomness implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new InsecureRandomness(address);
    }

    static createFromConfig(config: InsecureRandomnessConfig, code: Cell, workchain = 0) {
        const data = insecureRandomnessConfigToCell(config);
        const init = { code, data };
        return new InsecureRandomness(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
