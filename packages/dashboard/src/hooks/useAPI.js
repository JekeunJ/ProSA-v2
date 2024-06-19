import useSWR from 'swr';

export default function useAPI(endpoint, query = {}, options = {}) {
  const { data, error, mutate } = useSWR(endpoint && [`/api${endpoint}`, JSON.stringify(query)], options);

  return {
    ...(data || null),
    error,
    loading: !data && !error,
    mutate,
  };
}
