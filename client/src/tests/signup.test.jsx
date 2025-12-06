import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../components/Signup';
import { createMockLocalStorage } from './test-helpers';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

describe('Signup', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    mockNavigate.mockClear();

    Object.defineProperty(window, 'localStorage', {
      value: createMockLocalStorage(),
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('lets the user fill out each field', () => {
    render(<Signup />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const email = screen.getByLabelText(/^email$/i);
    const pasword = screen.getByLabelText(/^password$/i);
    const retypePassword = screen.getByLabelText(/retype password/i);


    fireEvent.change(firstNameInput, { target: { name: 'firstName', value: 'john' } });
    fireEvent.change(lastNameInput, { target: { name: 'lastName', value: 'doe' } });
    fireEvent.change(email, { target: { name: 'email', value: 'john@test.com' } });
    fireEvent.change(pasword, { target: { name: 'password', value: 'password' } });
    fireEvent.change(retypePassword, { target: { name: 'retypePassword', value: 'password' } });

    expect(screen.getByLabelText(/first name/i)).toHaveValue('john');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('doe');
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('john@test.com');
  });

  test('submits the form and saves user + token', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'new-token',
        user: { firstName: 'john' }
      })
    });

    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'john', name: 'firstName' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'doe', name: 'lastName' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'john@test.com', name: 'email' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password', name: 'password' } });
    fireEvent.change(screen.getByLabelText(/retype password/i), { target: { value: 'password', name: 'retypePassword' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    // First call → create user
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      '/api/users',
      expect.objectContaining({ method: 'POST' })
    );

    // Second call → login
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      '/api/users/login',
      expect.objectContaining({ method: 'POST' })
    );

    // Storage matches real component behavior
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'new-token');
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({ firstName: 'john' })
    );

    // Navigation after successful signup/login
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
