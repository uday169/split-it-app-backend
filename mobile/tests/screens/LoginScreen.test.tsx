import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../../src/screens/auth/LoginScreen';
import { useSendOtp } from '../../src/hooks/useAuth';

// Mock the hooks
jest.mock('../../src/hooks/useAuth');

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as any;

describe('LoginScreen', () => {
  const mockSendOtp = {
    mutateAsync: jest.fn(),
    isPending: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSendOtp as jest.Mock).mockReturnValue(mockSendOtp);
  });

  it('renders all elements correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} route={{} as any} />
    );

    expect(getByText('Split It')).toBeTruthy();
    expect(getByText('Share expenses easily')).toBeTruthy();
    expect(getByPlaceholderText('john@example.com')).toBeTruthy();
    expect(getByText('Send OTP')).toBeTruthy();
  });

  it('shows email label', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} route={{} as any} />
    );

    expect(getByText('Email')).toBeTruthy();
  });

  it('allows typing in email field', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} route={{} as any} />
    );

    const emailInput = getByPlaceholderText('john@example.com');
    fireEvent.changeText(emailInput, 'test@example.com');
    
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('calls sendOtp when form is submitted with valid email', async () => {
    mockSendOtp.mutateAsync.mockResolvedValue({});
    
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} route={{} as any} />
    );

    const emailInput = getByPlaceholderText('john@example.com');
    const submitButton = getByText('Send OTP');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSendOtp.mutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });

  it('navigates to OTP screen on successful OTP send', async () => {
    mockSendOtp.mutateAsync.mockResolvedValue({});
    
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} route={{} as any} />
    );

    const emailInput = getByPlaceholderText('john@example.com');
    const submitButton = getByText('Send OTP');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Otp', {
        email: 'test@example.com',
      });
    });
  });

  it('shows loading state when sending OTP', () => {
    (useSendOtp as jest.Mock).mockReturnValue({
      ...mockSendOtp,
      isPending: true,
    });

    const { queryByText } = render(
      <LoginScreen navigation={mockNavigation} route={{} as any} />
    );

    // Button text should not be visible when loading
    expect(queryByText('Send OTP')).toBeNull();
  });

  it('displays terms and privacy text', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} route={{} as any} />
    );

    expect(getByText(/Terms & Privacy Policy/i)).toBeTruthy();
  });
});
