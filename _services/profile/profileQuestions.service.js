import { fetcher } from '@/_api/fetcher';

export async function fetchProfileQuestions() {
  return fetcher('/profile');
}

export async function updateProfileField(field, value) {
  return fetcher('/profile', {
    method: 'PATCH',
    body: JSON.stringify({ field, value }),
  });
}
