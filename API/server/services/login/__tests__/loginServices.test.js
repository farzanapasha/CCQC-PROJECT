import loginServices from '../login'; // Adjust the import path as necessary
import DB from '../../../helpers/db'; // Import the DB mock
import Token from '../../../helpers/token'; // Import the Token mock

// Mocking DB and Token
jest.mock('../../../helpers/db');
jest.mock('../../../helpers/token');

describe('loginServices', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear any previous mock calls
    });

    it('should be defined', () => {
        expect(loginServices).toBeDefined();
    });

    it('should return isAuth true for valid user credentials', async () => {
        // Arrange: Mock the database response
        const mockUser = {
            email: 'test@example.com',
            password: 'password123'
        };

        const dbResponse = [{
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            gender: 'female',
            role: 'user',
            phone: '1234567890',
            password: 'password123'
        }];

        DB.mockReturnValue({
            join: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue(dbResponse),
        });

        Token.renew.mockReturnValue('mock-token');

        // Act: Call the login method
        const result = await loginServices.login(mockUser);

        // Assert: Check if the result is as expected
        expect(result).toEqual({
            isAuth: true,
            user: {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                gender: 'female',
                role: 'user',
                phone: '1234567890',
            },
            token: 'mock-token'
        });
    });

    it('should throw an error for invalid password', async () => {
        const mockUser = {
            email: 'test@example.com',
            password: 'wrongpassword'
        };

        const dbResponse = [{
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            gender: 'female',
            role: 'user',
            phone: '1234567890',
            password: 'password123'
        }];

        DB.mockReturnValue({
            join: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue(dbResponse),
        });

        await expect(loginServices.login(mockUser)).rejects.toThrow('User invalidPasswordException'); // Assuming you throw this error
    });

    it('should throw an error for non-existent user', async () => {
        const mockUser = {
            email: 'notfound@example.com',
            password: 'password123'
        };

        DB.mockReturnValue({
            join: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue([]), // No user found
        });

        await expect(loginServices.login(mockUser)).rejects.toThrow('User invalidUserException'); // Assuming you throw this error
    });
});
