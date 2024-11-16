import LeadController from '../createLead'; // Adjust the path as per your directory structure
import DB from '../../../helpers/db'; // Import the DB module

// Mocking the DB function
jest.mock('../../../helpers/db', () => jest.fn(() => ({
  insert: jest.fn(),
})));

describe('LeadController.create', () => {
  it('should create a lead successfully', async () => {
    // Arrange: Set up mock to return a resolved promise for the insert method
    const mockInsert = jest.fn().mockResolvedValueOnce(true); // Simulate successful DB insert
    DB.mockImplementationOnce(() => ({
      insert: mockInsert, // Return the mocked insert method
    }));

    const lead = { name: 'Jane Doe', email: 'jane.doe@example.com' };

    // Act: Call the create method
    const response = await LeadController.create(lead);

    // Assert: Verify the response message
    expect(response).toEqual({ message: 'lead created sucessfully' });

    // Ensure DB was called with the correct table name
    expect(DB).toHaveBeenCalledWith("lead");

    // Ensure insert was called with the correct lead data
    expect(mockInsert).toHaveBeenCalledWith(lead);
  });

  it('should throw an error when DB insert fails', async () => {
    // Arrange: Set up mock to return a rejected promise for the insert method
    const mockInsert = jest.fn().mockRejectedValueOnce(new Error('Database error')); // Simulate failure
    DB.mockImplementationOnce(() => ({
      insert: mockInsert, // Return the mocked insert method
    }));

    const lead = { name: 'Jane Doe', email: 'jane.doe@example.com' };

    // Act & Assert: Verify error handling
    await expect(LeadController.create(lead)).rejects.toThrow('Database error');
  });
});
