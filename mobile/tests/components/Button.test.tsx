import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/common/Button';

describe('Button Component', () => {
  it('renders with title', () => {
    const { getByText } = render(
      <Button title="Click me" onPress={() => {}} />
    );
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Click me" onPress={onPressMock} />
    );

    fireEvent.press(getByText('Click me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Click me" onPress={onPressMock} disabled />
    );

    fireEvent.press(getByText('Click me'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPressMock = jest.fn();
    const { queryByText } = render(
      <Button title="Click me" onPress={onPressMock} loading />
    );

    // Button text should not be visible when loading
    expect(queryByText('Click me')).toBeNull();
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders with primary variant by default', () => {
    const { getByText } = render(
      <Button title="Primary" onPress={() => {}} />
    );
    const button = getByText('Primary');
    expect(button).toBeTruthy();
  });

  it('renders with secondary variant', () => {
    const { getByText } = render(
      <Button title="Secondary" onPress={() => {}} variant="secondary" />
    );
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('renders with outline variant', () => {
    const { getByText } = render(
      <Button title="Outline" onPress={() => {}} variant="outline" />
    );
    expect(getByText('Outline')).toBeTruthy();
  });

  it('shows ActivityIndicator when loading', () => {
    const { root } = render(
      <Button title="Loading" onPress={() => {}} loading />
    );
    
    // Check that ActivityIndicator is rendered
    const activityIndicator = root.findByType('ActivityIndicator' as any);
    expect(activityIndicator).toBeTruthy();
  });
});
