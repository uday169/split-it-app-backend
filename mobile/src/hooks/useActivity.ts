import { useQuery } from '@tanstack/react-query';
import { activityApi } from '../api/activity.api';

export const useActivity = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['activity', page, limit],
    queryFn: () => activityApi.getActivity(page, limit),
    staleTime: 1000 * 60, // 1 minute
  });
};
