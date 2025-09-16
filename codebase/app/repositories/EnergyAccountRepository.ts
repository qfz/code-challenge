import { MOCK_ENERGY_ACCOUNTS_API, type EnergyAccount } from "../example-mocks/energyAccountsAPIMock";

export interface IEnergyAccountRepository {
    getAllEnergyAccounts(): Promise<EnergyAccount[]>
}

/**
 * Repository for handling energy accounts.
 */
export class EnergyAccountRepository implements IEnergyAccountRepository {

    async getAllEnergyAccounts(): Promise<EnergyAccount[]> {
        return await MOCK_ENERGY_ACCOUNTS_API();
    }
}