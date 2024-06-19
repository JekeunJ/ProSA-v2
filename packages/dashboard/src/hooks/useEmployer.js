import useSWR from 'swr';

export default function usePractice() {
  const { data, error, mutate } = useSWR(
    '/api/auth/employer',
    { shouldRetryOnError: false },
  );

  return {
    ...data,
    error: error?.toJSON().status ? error : null,
    loading: !data && !error,
    mutate,
  };
}
