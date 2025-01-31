import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type AuctionDelayedConfig = {};

export function auctionDelayedConfigToCell(config: AuctionDelayedConfig): Cell {
    return beginCell().endCell();
}

export class AuctionDelayed implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new AuctionDelayed(address);
    }

    static createFromConfig(config: AuctionDelayedConfig, code: Cell, workchain = 0) {
        const data = auctionDelayedConfigToCell(config);
        const init = { code, data };
        return new AuctionDelayed(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
