const REQ_URI = 'http://localhost:9000/graphql';

async function graphqlRequest(query, variables = {}) {
  const response = await fetch(REQ_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    })
  })
  const responseBody = await response.json();
  if (responseBody.errors) {
    const message = responseBody.errors.map(({ message }) => message).join("\n");
    throw new Error(message);
  }
  return responseBody.data;
}

export async function loadJobs() {
  const query = `{
        jobs {
          id
          title
          company {
              id
              name
          }
        }
      }`;
  const { jobs } = await graphqlRequest(query);
  return jobs;
}

export async function loadJob(id) {
  const query = `query JobQuery($id: ID!) {
        job(id: $id) {
          id
          title
          description
          company {
            id
            name
          }
        }
      }`
  const { job } = await graphqlRequest(query, { id })
  return job;
};

export async function loadComapny(id) {
  const query = `query CompanyQuery($id: ID!) {
        company(id: $id) {
          name
          id
          description
          jobs {
            id
            title
          }
        }
      }`;
  const { company } = await graphqlRequest(query, { id });
  return company;
};