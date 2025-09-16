import { type DueCharge, MOCK_DUE_CHARGES_API } from "../example-mocks/dueChargesAPIMock";


export interface IDueChargeRepository {
    getAllDueCharges(): Promise<DueCharge[]>
}

/**
 * Repository for handling due charges.
 */
export class DueChargeRepository implements IDueChargeRepository {
    async getAllDueCharges() {
        return await MOCK_DUE_CHARGES_API();
    }
}