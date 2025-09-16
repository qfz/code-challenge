import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCK_ENERGY_ACCOUNTS_API } from '../example-mocks/energyAccountsAPIMock';
import { EnergyAccountRepository } from './EnergyAccountRepository';

// Mock the MOCK_ENERGY_ACCOUNTS_API function
vi.mock('../example-mocks/energyAccountsAPIMock', () => ({
    MOCK_ENERGY_ACCOUNTS_API: vi.fn(),
}));

type MockFnReturnType = ReturnType<typeof vi.fn>

describe(`${EnergyAccountRepository.name}`, () => {
    let repository: EnergyAccountRepository;

    beforeEach(() => {
        repository = new EnergyAccountRepository();
    });


    it('should return an array of EnergyAccount objects when getAllEnergyAccounts is called', async () => {
        // Arrange
        const mockEnergyAccounts = [
            {
                id: 'A-0008',
                type: 'ELECTRICITY',
                address: '1 somewhere street, Melbourne, 3000, Victoria',
                meterNumber: '22223141443',
            },
            {
                id: 'A-0009',
                type: 'ELECTRICITY',
                address: '123 George St, Sydney, 2000, New South Wales',
                meterNumber: '987654321',
            },
        ];
        (MOCK_ENERGY_ACCOUNTS_API as MockFnReturnType).mockResolvedValue(mockEnergyAccounts);

        // Act
        const result = await repository.getAllEnergyAccounts();

        // Assert
        expect(MOCK_ENERGY_ACCOUNTS_API).toHaveBeenCalled();
        expect(result).toEqual(mockEnergyAccounts);
        expect(Array.isArray(result)).toBe(true);
    });

    it('should handle errors thrown by MOCK_ENERGY_ACCOUNTS_API', async () => {
        // Arrange
        const errorMessage = 'Failed to fetch energy accounts';
        (MOCK_ENERGY_ACCOUNTS_API as MockFnReturnType).mockRejectedValue(new Error(errorMessage));

        // Act & Assert
        await expect(repository.getAllEnergyAccounts()).rejects.toThrow(errorMessage);
        expect(MOCK_ENERGY_ACCOUNTS_API).toHaveBeenCalled();
    });

    it('should return an empty array when MOCK_ENERGY_ACCOUNTS_API returns an empty array', async () => {
        // Arrange
        (MOCK_ENERGY_ACCOUNTS_API as MockFnReturnType).mockResolvedValue([]);

        // Act
        const result = await repository.getAllEnergyAccounts();

        // Assert
        expect(MOCK_ENERGY_ACCOUNTS_API).toHaveBeenCalled();
        expect(result).toEqual([]);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });
});