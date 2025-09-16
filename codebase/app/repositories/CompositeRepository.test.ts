import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CompositeRepository } from './CompositeRepository';
import type { Payment } from './PaymentRepository';

// Mock dependencies
const mockDueChargeRepository = {
    getAllDueCharges: vi.fn(),
};

const mockEnergyAccountRepository = {
    getAllEnergyAccounts: vi.fn(),
};

const mockPaymentRepository = {
    add: vi.fn(),
    getAllPayments: vi.fn(),
};

describe(`${CompositeRepository.name}`, () => {
    let repository: CompositeRepository;

    beforeEach(() => {
        // Reset mocks before each test
        vi.resetAllMocks();
        repository = new CompositeRepository(
            mockDueChargeRepository,
            mockEnergyAccountRepository,
            mockPaymentRepository
        );
    });

    describe('getAllEnergyAccountsWithBalance', () => {
        it('should return energy accounts with calculated balances', async () => {
            // Arrange
            const mockEnergyAccounts = [
                { id: 'A-0001', type: 'ELECTRICITY', address: '123 Main St', meterNumber: '1111' },
                { id: 'A-0002', type: 'GAS', address: '456 Oak St', meterNumber: '2222' },
            ];
            const mockDueCharges = [
                { id: 1, accountId: 'A-0001', date: '2025-10-01', amount: 100 },
                { id: 2, accountId: 'A-0001', date: '2025-11-01', amount: 50 },
                { id: 3, accountId: 'A-0002', date: '2025-10-01', amount: 200 },
            ];
            const mockPayments = [
                { accountId: 'A-0001', amount: 50 },
                { accountId: 'A-0002', amount: 100 },
            ];

            mockEnergyAccountRepository.getAllEnergyAccounts.mockResolvedValue(mockEnergyAccounts);
            mockDueChargeRepository.getAllDueCharges.mockResolvedValue(mockDueCharges);
            mockPaymentRepository.getAllPayments.mockResolvedValue(mockPayments);

            // Act
            const result = await repository.getAllEnergyAccountsWithBalance();

            // Assert
            expect(mockEnergyAccountRepository.getAllEnergyAccounts).toHaveBeenCalled();
            expect(mockDueChargeRepository.getAllDueCharges).toHaveBeenCalled();
            expect(mockPaymentRepository.getAllPayments).toHaveBeenCalled();
            expect(result).toEqual([
                { ...mockEnergyAccounts[0], balance: 100 }, // 100 + 50 - 50 = 100
                { ...mockEnergyAccounts[1], balance: 100 }, // 200 - 100 = 100
            ]);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
        });

        it('should return accounts with zero balance if no due charges or payments exist', async () => {
            // Arrange
            const mockEnergyAccounts = [
                { id: 'A-0001', type: 'ELECTRICITY', address: '123 Main St', meterNumber: '1111' },
            ];
            mockEnergyAccountRepository.getAllEnergyAccounts.mockResolvedValue(mockEnergyAccounts);
            mockDueChargeRepository.getAllDueCharges.mockResolvedValue([]);
            mockPaymentRepository.getAllPayments.mockResolvedValue([]);

            // Act
            const result = await repository.getAllEnergyAccountsWithBalance();

            // Assert
            expect(result).toEqual([{ ...mockEnergyAccounts[0], balance: undefined }]);
            expect(mockEnergyAccountRepository.getAllEnergyAccounts).toHaveBeenCalled();
            expect(mockDueChargeRepository.getAllDueCharges).toHaveBeenCalled();
            expect(mockPaymentRepository.getAllPayments).toHaveBeenCalled();
        });
    });

    describe('getEnergyAccountWithBalanceById', () => {
        it('should return the energy account with balance for a given id', async () => {
            // Arrange
            const mockEnergyAccounts = [
                { id: 'A-0001', type: 'ELECTRICITY', address: '123 Main St', meterNumber: '1111' },
            ];
            const mockDueCharges = [{ id: 1, accountId: 'A-0001', date: '2025-10-01', amount: 100 }];
            const mockPayments = [{ accountId: 'A-0001', amount: 50 }];

            mockEnergyAccountRepository.getAllEnergyAccounts.mockResolvedValue(mockEnergyAccounts);
            mockDueChargeRepository.getAllDueCharges.mockResolvedValue(mockDueCharges);
            mockPaymentRepository.getAllPayments.mockResolvedValue(mockPayments);

            // Act
            const result = await repository.getEnergyAccountWithBalanceById('A-0001');

            // Assert
            expect(result).toEqual({ ...mockEnergyAccounts[0], balance: 50 });
            expect(mockEnergyAccountRepository.getAllEnergyAccounts).toHaveBeenCalled();
            expect(mockDueChargeRepository.getAllDueCharges).toHaveBeenCalled();
            expect(mockPaymentRepository.getAllPayments).toHaveBeenCalled();
        });

        it('should return undefined if no account matches the id', async () => {
            // Arrange
            const mockEnergyAccounts = [
                { id: 'A-0001', type: 'ELECTRICITY', address: '123 Main St', meterNumber: '1111' },
            ];
            mockEnergyAccountRepository.getAllEnergyAccounts.mockResolvedValue(mockEnergyAccounts);
            mockDueChargeRepository.getAllDueCharges.mockResolvedValue([]);
            mockPaymentRepository.getAllPayments.mockResolvedValue([]);

            // Act
            const result = await repository.getEnergyAccountWithBalanceById('A-9999');

            // Assert
            expect(result).toBeUndefined();
        });
    });

    describe('pay', () => {
        it('should add a payment if the account exists and has a balance', async () => {
            // Arrange
            const mockEnergyAccounts = [
                { id: 'A-0001', type: 'ELECTRICITY', address: '123 Main St', meterNumber: '1111' },
            ];
            const mockDueCharges = [{ id: 1, accountId: 'A-0001', date: '2025-10-01', amount: 100 }];
            const mockPayments: Payment[] = [];
            const payment: Payment = { accountId: 'A-0001', amount: 50 };

            mockEnergyAccountRepository.getAllEnergyAccounts.mockResolvedValue(mockEnergyAccounts);
            mockDueChargeRepository.getAllDueCharges.mockResolvedValue(mockDueCharges);
            mockPaymentRepository.getAllPayments.mockResolvedValue(mockPayments);
            mockPaymentRepository.add.mockResolvedValue(undefined);

            // Act
            await repository.pay(payment);

            // Assert
            expect(mockPaymentRepository.add).toHaveBeenCalledWith(payment);
            expect(mockEnergyAccountRepository.getAllEnergyAccounts).toHaveBeenCalled();
            expect(mockDueChargeRepository.getAllDueCharges).toHaveBeenCalled();
            expect(mockPaymentRepository.getAllPayments).toHaveBeenCalled();
        });

        it('should throw an error if the account does not exist', async () => {
            // Arrange
            const mockEnergyAccounts = [
                { id: 'A-0001', type: 'ELECTRICITY', address: '123 Main St', meterNumber: '1111' },
            ];
            const payment: Payment = { accountId: 'A-9999', amount: 50 };

            mockEnergyAccountRepository.getAllEnergyAccounts.mockResolvedValue(mockEnergyAccounts);
            mockDueChargeRepository.getAllDueCharges.mockResolvedValue([]);
            mockPaymentRepository.getAllPayments.mockResolvedValue([]);

            // Act & Assert
            await expect(repository.pay(payment)).rejects.toThrow(
                'No balance found, could not pay for this account.'
            );
            expect(mockPaymentRepository.add).not.toHaveBeenCalled();
        });

        it('should throw an error if the account has no balance', async () => {
            // Arrange
            const mockEnergyAccounts = [
                { id: 'A-0001', type: 'ELECTRICITY', address: '123 Main St', meterNumber: '1111' },
            ];
            const payment: Payment = { accountId: 'A-0001', amount: 50 };

            mockEnergyAccountRepository.getAllEnergyAccounts.mockResolvedValue(mockEnergyAccounts);
            mockDueChargeRepository.getAllDueCharges.mockResolvedValue([]);
            mockPaymentRepository.getAllPayments.mockResolvedValue([]);

            // Act & Assert
            await expect(repository.pay(payment)).rejects.toThrow(
                'No balance found, could not pay for this account.'
            );
            expect(mockPaymentRepository.add).not.toHaveBeenCalled();
        });
    });
});