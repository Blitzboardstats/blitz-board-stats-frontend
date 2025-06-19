
import { useTeamEventsQuery } from './useTeamEventsQuery';
import { useUserTeamsQuery } from './useUserTeamsQuery';
import { useEventMutations } from './useEventMutations';

export const useTeamEvents = () => {
  const { data: events = [], isLoading, error } = useTeamEventsQuery();
  const { data: userTeams = [] } = useUserTeamsQuery();
  const mutations = useEventMutations();

  return {
    events,
    userTeams,
    isLoading,
    error,
    ...mutations,
  };
};
