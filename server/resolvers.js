const db = require('./db');

const getJobs = () => db.jobs.list();
const company = (id = '03') => db.companies.get(id);
const getJob = (id) => db.jobs.get(id);

const Query = {
  job: (root, args, context, info) => {
    console.log(root, args, `context: ${context}`, `info: ${info}`);
    return getJob(args.id);
  },
  jobs: () => getJobs(),
  company: (root, {id}) => company(id)
}

const Job = {
  company: (d) => company(d.companyId)
}


module.exports = { Query, Job };