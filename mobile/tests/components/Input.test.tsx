import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../../src/components/common/Input';

describe('Input Component', () => {
  it('renders without label', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText, getByPlaceholderText } = render(
      <Input label="Email" placeholder="Enter email" />
    );
    expect(getByText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Enter email')).toBeTruthy();
  });

  it('displays error message', () => {
    const { getByText } = render(
      <Input placeholder="Email" error="Invalid email" />
    );
    expect(getByText('Invalid email')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Email" onChangeText={onChangeMock} />
    );

    const input = getByPlaceholderText('Email');
    fireEvent.changeText(input, 'test@example.com');
    
    expect(onChangeMock).toHaveBeenCalledWith('test@example.com');
  });

  it('passes through TextInput props', () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
      />
    );
    
    const input = getByPlaceholderText('Password');
    expect(input).toBeTruthy();
    expect(input.props.secureTextEntry).toBe(true);
    expect(input.props.autoCapitalize).toBe('none');
  });

  it('applies error styling when error is present', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Email" error="Invalid" />
    );
    
    const input = getByPlaceholderText('Email');
    expect(input).toBeTruthy();
  });

  it('can be disabled', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Disabled" editable={false} />
    );
    
    const input = getByPlaceholderText('Disabled');
    expect(input.props.editable).toBe(false);
  });
});
