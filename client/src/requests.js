const REQ_URI = 'http://localhost:9000/graphql';

export async function loadJobs() {
  const response = await fetch(REQ_URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{
        jobs {
          id
          title
          company {
              id
              name
          }
        }
      }`
    })
  });
  const respBody = await response.json();
  return respBody.data.jobs;
}
