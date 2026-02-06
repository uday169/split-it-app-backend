import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Card } from '../../src/components/common/Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('renders multiple children', () => {
    const { getByText } = render(
      <Card>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </Card>
    );
    expect(getByText('First Child')).toBeTruthy();
    expect(getByText('Second Child')).toBeTruthy();
  });

  it('accepts custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { root } = render(
      <Card style={customStyle}>
        <Text>Styled Card</Text>
      </Card>
    );
    
    const card = root.findByType(Card);
    expect(card).toBeTruthy();
  });

  it('passes through View props', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Card testID="test-card" onTouchEnd={onPressMock}>
        <Text>Pressable Card</Text>
      </Card>
    );
    
    const card = getByTestId('test-card');
    expect(card).toBeTruthy();
  });
});
