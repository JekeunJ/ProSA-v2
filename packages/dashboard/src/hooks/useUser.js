import useSWR from 'swr';

export default function useUser() {
  const { data, error, mutate } = useSWR(
    '/api/auth/user',
    { shouldRetryOnError: false },
  );

  return {
    ...data,
    error: error?.toJSON().status ? error : null,
    loading: !data && !error,
    mutate,
  };
}
