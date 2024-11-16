import ClientController from '../createClient'; // Adjust the import path as needed
import DB from '../../../helpers/db'; // Import the DB module

// Mocking the DB function properly
jest.mock('../../../helpers/db', () => jest.fn(() => ({
  insert: jest.fn(),
})));

describe('ClientController.create', () => {
  it('should create a client successfully', async () => {
    // Arrange: Set up mock to return a resolved promise for the insert method
    const mockInsert = jest.fn().mockResolvedValueOnce(true); // Simulate successful DB insert
    DB.mockImplementationOnce(() => ({
      insert: mockInsert, // Return the mocked insert method
    }));

    const client = { name: 'John Doe', email: 'john.doe@example.com' };

    // Act: Call the create method
    const response = await ClientController.create(client);

    // Assert: Verify the response message
    expect(response).toEqual({ message: 'client created sucessfully' });
    
    // Ensure DB was called with the correct table name
    expect(DB).toHaveBeenCalledWith("client");

    // Ensure insert was called with the correct client data
    expect(mockInsert).toHaveBeenCalledWith(client);
  });

  it('should throw an error when DB insert fails', async () => {
    // Arrange: Set up mock to return a rejected promise for the insert method
    const mockInsert = jest.fn().mockRejectedValueOnce(new Error('Database error')); // Simulate failure
    DB.mockImplementationOnce(() => ({
      insert: mockInsert, // Return the mocked insert method
    }));

    const client = { name: 'John Doe', email: 'john.doe@example.com' };

    // Act & Assert: Verify error handling
    await expect(ClientController.create(client)).rejects.toThrow('Database error');
  });
});

