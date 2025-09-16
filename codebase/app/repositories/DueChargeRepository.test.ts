import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCK_DUE_CHARGES_API } from '../example-mocks/dueChargesAPIMock';
import { DueChargeRepository } from './DueChargeRepository';

// Mock the MOCK_DUE_CHARGES_API function
vi.mock('../example-mocks/dueChargesAPIMock', () => ({
    MOCK_DUE_CHARGES_API: vi.fn(),
}));

type MockFnReturnType = ReturnType<typeof vi.fn>

describe(`${DueChargeRepository.name}`, () => {
    let repository: DueChargeRepository;

    beforeEach(() => {
        repository = new DueChargeRepository();
    });


    it('should return an array of DueCharge objects when getAllDueCharges is called', async () => {
        // Arrange
        const mockDueCharges = [
            { id: 1, accountId: 'acc1', date: '2025-10-01', amount: 100 },
            { id: 2, accountId: 'acc2', date: '2025-11-01', amount: 200 },
        ];
        (MOCK_DUE_CHARGES_API as MockFnReturnType).mockResolvedValue(mockDueCharges);

        // Act
        const result = await repository.getAllDueCharges();

        // Assert
        expect(MOCK_DUE_CHARGES_API).toHaveBeenCalled();
        expect(result).toEqual(mockDueCharges);
        expect(Array.isArray(result)).toBe(true);
    });

    it('should handle errors thrown by MOCK_DUE_CHARGES_API', async () => {
        // Arrange
        const errorMessage = 'Failed to fetch due charges';
        (MOCK_DUE_CHARGES_API as MockFnReturnType).mockRejectedValue(new Error(errorMessage));

        // Act & Assert
        await expect(repository.getAllDueCharges()).rejects.toThrow(errorMessage);
        expect(MOCK_DUE_CHARGES_API).toHaveBeenCalled();
    });

    it('should return an empty array when MOCK_DUE_CHARGES_API returns an empty array', async () => {
        // Arrange
        (MOCK_DUE_CHARGES_API as MockFnReturnType).mockResolvedValue([]);

        // Act
        const result = await repository.getAllDueCharges();

        // Assert
        expect(MOCK_DUE_CHARGES_API).toHaveBeenCalled();
        expect(result).toEqual([]);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });
});