import type { EnergyAccount } from "../example-mocks/energyAccountsAPIMock";
import { DueChargeRepository, type IDueChargeRepository } from "./DueChargeRepository";
import { EnergyAccountRepository, type IEnergyAccountRepository } from "./EnergyAccountRepository";
import { PaymentRepository, type IPaymentRepository, type Payment } from "./PaymentRepository";


export type EnergyAccountWithBalance = EnergyAccount & {
    balance?: number
}

interface ICompositeRepository {
    getAllEnergyAccountsWithBalance(): Promise<EnergyAccountWithBalance[]>
    pay(payment: Payment): Promise<void>
}

/**
 * This repository is used for functionalities that require data from multiple
 * repositories, hence it's called "Composite" for the lack of a better name.
 */
export class CompositeRepository implements ICompositeRepository {
    dueChargeRepository: IDueChargeRepository;
    energyAccountRepository: IEnergyAccountRepository;
    paymentRepository: IPaymentRepository;

    constructor(
        dueChargeRepository: IDueChargeRepository,
        energyAccountRepository: IEnergyAccountRepository,
        paymentRepository: IPaymentRepository
    ) {
        this.dueChargeRepository = dueChargeRepository;
        this.energyAccountRepository = energyAccountRepository;
        this.paymentRepository = paymentRepository;
    }

    async getAllEnergyAccountsWithBalance() {

        const energyAccounts = await this.energyAccountRepository.getAllEnergyAccounts();

        const dueCharges = await this.dueChargeRepository.getAllDueCharges();


        // transform dueCharges to a map to avoid looping through them every time we
        // need to find the amount due for an account.
        const accountBalanceMap = new Map<string, number>();

        for (const charge of dueCharges) {
            const currentBalance = accountBalanceMap.get(charge.accountId)

            accountBalanceMap.set(charge.accountId, (currentBalance ?? 0) + charge.amount)
        }

        // Substract payments from account balance.
        const payments = await this.paymentRepository.getAllPayments();
        for (const payment of payments) {
            const currentBalance = accountBalanceMap.get(payment.accountId);

            accountBalanceMap.set(payment.accountId, (currentBalance ?? 0) - payment.amount);
        }


        // Create a new list of energy accounts with their balance added
        const energyAccountsWithBalance = energyAccounts.map(account => ({
            ...account,
            balance: accountBalanceMap.get(account.id)
        }));

        return energyAccountsWithBalance;
    }

    async getEnergyAccountWithBalanceById(id: string) {
        const allAccounts = await this.getAllEnergyAccountsWithBalance();

        return allAccounts.find(account => account.id === id);
    }

    async pay(payment: Payment) {
        const targetAccount = await this.getEnergyAccountWithBalanceById(payment.accountId);

        if (!targetAccount?.balance) {
            throw new PaymentError("No balance found, could not pay for this account.")
        }

        this.paymentRepository.add(payment);
    }
}

export class PaymentError extends Error { }


/**
 * A default CompositeRepository for convenience
 */
export const defaultCompositeRepository = new CompositeRepository(
    new DueChargeRepository(),
    new EnergyAccountRepository(),
    new PaymentRepository()
)