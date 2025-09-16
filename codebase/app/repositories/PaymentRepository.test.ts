import { beforeEach, describe, expect, it } from 'vitest';
import { type Payment, PaymentRepository } from './PaymentRepository';

describe(`${PaymentRepository.name}`, () => {
    let repository: PaymentRepository;

    beforeEach(() => {
        // Reset the static storage before each test
        PaymentRepository.storage = [];
        repository = new PaymentRepository();
    });

    it('should add a payment to the storage', async () => {
        // Arrange
        const payment: Payment = { accountId: 'acc1', amount: 100 };

        // Act
        await repository.add(payment);

        // Assert
        expect(PaymentRepository.storage).toContainEqual(payment);
        expect(PaymentRepository.storage.length).toBe(1);
    });

    it('should add multiple payments to the storage', async () => {
        // Arrange
        const payment1: Payment = { accountId: 'acc1', amount: 100 };
        const payment2: Payment = { accountId: 'acc2', amount: 200 };

        // Act
        await repository.add(payment1);
        await repository.add(payment2);

        // Assert
        expect(PaymentRepository.storage).toContainEqual(payment1);
        expect(PaymentRepository.storage).toContainEqual(payment2);
        expect(PaymentRepository.storage.length).toBe(2);
    });

    it('should return all payments from storage', async () => {
        // Arrange
        const payment1: Payment = { accountId: 'acc1', amount: 100 };
        const payment2: Payment = { accountId: 'acc2', amount: 200 };
        await repository.add(payment1);
        await repository.add(payment2);

        // Act
        const result = await repository.getAllPayments();

        // Assert
        expect(result).toEqual([payment1, payment2]);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
    });

    it('should return an empty array when no payments are in storage', async () => {
        // Act
        const result = await repository.getAllPayments();

        // Assert
        expect(result).toEqual([]);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });
});