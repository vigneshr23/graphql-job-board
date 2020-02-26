const db = require('./db');

const getJobs = () => db.jobs.list();
const company = (id = '03') => db.companies.get(id);
const getJob = (id) => db.jobs.get(id);

const Query = {
  job: (root, {id}) => getJob(id),
  jobs: () => getJobs(),
  company: (root, {id}) => company(id)
}

const Company = {
  jobs: (company) => db.jobs.list().filter(job => job.companyId === company.id)
}

const Job = {
  company: (d) => company(d.companyId)
}


module.exports = { Query, Company, Job };