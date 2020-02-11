const db = require('./db');

const getJobs = () => db.jobs.list();
const company = (id = '03') => db.companies.get(id);
const getJob = (id) => db.jobs.get(id);

const Query = {
  job: (root, { id }, context, info) => {
    console.log(root, id, `context: ${context}`, `info: ${info}`);
    return getJob(id);
  },
  jobs: () => getJobs(),
  company: () => company()
}

const Job = {
  company: (d) => company(d.companyId)
}


module.exports = { Query, Job };