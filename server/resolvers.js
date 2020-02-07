const db = require('./db');

const getJobs = () => db.jobs.list();
const company = (id = '03') => db.companies.get(id);

const Query = {
    jobs: () => getJobs(),
    company: () => company()
}

const Job = {
    company: (d) => company(d.companyId)
}


module.exports = { Query, Job };