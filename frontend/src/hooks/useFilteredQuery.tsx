import { useState } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';

interface UseFilteredQueryOptions<TData, TFilters> {
  queryKey: string;
  queryFn: (filters: TFilters) => Promise<TData>;
  initialFilters?: TFilters;
  queryOptions?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>;
}

export default function useFilteredQuery<
  TData,
  TFilters extends Record<string, any>
>({
  queryKey,
  queryFn,
  initialFilters = {} as TFilters,
  queryOptions = {},
}: UseFilteredQueryOptions<TData, TFilters>) {
  const [filters, setFilters] = useState<TFilters>(initialFilters);

  const { data, isLoading, refetch, isFetching } = useQuery<TData>(
    [queryKey, ...Object.values(filters)],
    () => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== '' && value !== undefined,
        ),
      ) as TFilters;
      return queryFn(cleanFilters);
    },
    {
      refetchOnWindowFocus: false,
      ...queryOptions,
    },
  );

  const updateFilter = <K extends keyof TFilters>(
    key: K,
    value: TFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    data,
    isLoading,
    isFetching,
    refetch,
    filters,
    updateFilter,
    resetFilters,
    setFilters,
  };
}
