
export interface Payment {
    accountId: string;
    amount: number;
}

export interface IPaymentRepository {
    add(payment: Payment): void;
    getAllPayments(): Promise<Payment[]>
}

/**
 * Repository for handling payments.
 */
export class PaymentRepository {
    static storage: Payment[] = [];

    async add(payment: Payment) {
        PaymentRepository.storage.push(payment)
    }

    async getAllPayments() {
        return PaymentRepository.storage;
    }
}