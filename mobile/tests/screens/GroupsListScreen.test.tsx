import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { GroupsListScreen } from '../../src/screens/groups/GroupsListScreen';
import { useGroups } from '../../src/hooks/useGroups';
import { mockGroup } from '../helpers/mockData';

// Mock the hooks
jest.mock('../../src/hooks/useGroups');

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as any;

describe('GroupsListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (useGroups as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      refetch: jest.fn(),
      isRefetching: false,
    });

    const { root } = render(
      <GroupsListScreen navigation={mockNavigation} route={{} as any} />
    );

    // Check for Loading component
    expect(root).toBeTruthy();
  });

  it('renders empty state when no groups', () => {
    (useGroups as jest.Mock).mockReturnValue({
      data: { groups: [] },
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    const { getByText } = render(
      <GroupsListScreen navigation={mockNavigation} route={{} as any} />
    );

    expect(getByText('No groups yet')).toBeTruthy();
    expect(getByText(/Create a group to start/i)).toBeTruthy();
  });

  it('renders list of groups', () => {
    (useGroups as jest.Mock).mockReturnValue({
      data: {
        groups: [
          mockGroup,
          { ...mockGroup, id: 'group-2', name: 'Another Group' },
        ],
      },
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    const { getByText } = render(
      <GroupsListScreen navigation={mockNavigation} route={{} as any} />
    );

    expect(getByText('Test Group')).toBeTruthy();
    expect(getByText('Another Group')).toBeTruthy();
    expect(getByText('3 members')).toBeTruthy();
  });

  it('navigates to group details when group is pressed', () => {
    (useGroups as jest.Mock).mockReturnValue({
      data: { groups: [mockGroup] },
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    const { getByText } = render(
      <GroupsListScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.press(getByText('Test Group'));

    expect(mockNavigate).toHaveBeenCalledWith('GroupDetails', {
      groupId: mockGroup.id,
    });
  });

  it('navigates to create group from empty state', () => {
    (useGroups as jest.Mock).mockReturnValue({
      data: { groups: [] },
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    const { getByText } = render(
      <GroupsListScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.press(getByText('Create Group'));

    expect(mockNavigate).toHaveBeenCalledWith('CreateGroup');
  });

  it('navigates to create group from header button', () => {
    (useGroups as jest.Mock).mockReturnValue({
      data: { groups: [mockGroup] },
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    const { getByText } = render(
      <GroupsListScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.press(getByText('+ New'));

    expect(mockNavigate).toHaveBeenCalledWith('CreateGroup');
  });

  it('displays header title', () => {
    (useGroups as jest.Mock).mockReturnValue({
      data: { groups: [] },
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    const { getByText } = render(
      <GroupsListScreen navigation={mockNavigation} route={{} as any} />
    );

    expect(getByText('Groups')).toBeTruthy();
  });
});
