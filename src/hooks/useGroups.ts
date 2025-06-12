// src/hooks/useGroups.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '../services/supabase/client';

export const useGroups = () => {
  return useQuery(
    'groups',
    async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner(user_id),
          expenses(id, total_amount, status)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};