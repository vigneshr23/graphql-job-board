import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from "apollo-boost";
import gql from "graphql-tag";
import { getAccessToken, isLoggedIn } from "./auth";

const REQ_URI = "http://localhost:9000/graphql";

const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${getAccessToken()}`
      }
    });
  }
  return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, new HttpLink({ uri: REQ_URI })]),

  cache: new InMemoryCache()
});

const getAuthToken = () => {
  const token = localStorage.getItem("accessToken");
  return token ? `Bearer ${token}` : null;
};

async function graphqlRequest(query, variables = {}) {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    })
  };

  if (isLoggedIn()) {
    request.headers["Authorization"] = `Bearer ${getAccessToken()}`;
  }

  const response = await fetch(REQ_URI, request);
  const responseBody = await response.json();
  if (responseBody.errors) {
    const message = responseBody.errors
      .map(({ message }) => message)
      .join("\n");
    throw new Error(message);
  }
  return responseBody.data;
}

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    description
    company {
      id
      name
    }
  }
`;

const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

const companyQuery = gql`
  query CompanyQuery($id: ID!) {
    company(id: $id) {
      name
      id
      description
      jobs {
        id
        title
      }
    }
  }
`;

const jobQuery = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

const jobsQuery = gql`
  query JobsQuery {
    jobs {
      id
      title
      company {
        id
        name
      }
    }
  }
`;

export async function loadJobs() {
  const query = jobsQuery;
  const {
    data: { jobs }
  } = await client.query({ query, fetchPolicy: "no-cache" });

  return jobs;
}

export async function loadJob(id) {
  const query = jobQuery;
  //const { job } = await graphqlRequest(query, { id });
  const {
    data: { job }
  } = await client.query({ query, variables: { id } });
  return job;
}

export async function loadComapny(id) {
  //const { company } = await graphqlRequest(query, { id });
  const query = companyQuery;
  const {
    data: { company }
  } = await client.query({ query, variables: { id } });
  return company;
}

export async function createJob(input) {
  //const { job } = await graphqlRequest(mutation, { input });
  const {
    data: { job }
  } = await client.mutate({
    createJobMutation,
    variables: { input },
    update: (cache, { data }) => {
      console.log("mutation resul: ", { cache, data });
      cache.writeQuery({
        query: jobQuery, // tells which opertation to cache
        variables: { id: data.job.id },
        data
      });
    }
  });
  return job;
}
