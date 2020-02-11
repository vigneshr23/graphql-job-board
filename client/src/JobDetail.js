import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import { jobs } from './fake-data';
import { loadJob } from "./requests";

export class JobDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { job: null };
    //this.state = { job: jobs.find((job) => job.id === jobId) };
  }

  async componentDidMount() {
    const { jobId } = this.props.match.params;

    const { job } = await loadJob(jobId);
    this.setState({ job });
  }

  render() {
    console.log(this.state)
    const { job } = this.state;
    if (job) {
      return (
        <div>
          <h1 className="title">{job.title}</h1>
          <h2 className="subtitle">
            <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
          </h2>
          <div className="box">{job.description}</div>
        </div>
      );
    } else {
      return <h4>Loading...</h4>
    }
  }
}
