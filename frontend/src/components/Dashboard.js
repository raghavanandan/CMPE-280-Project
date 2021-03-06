import React, { Component } from 'react';
import {Redirect} from 'react-router';
// import AppliedUsers from './AppliedUsers';
import Navbar from './Navbar';
import * as API from '../api/API';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      emailID: this.props.location.state.email,
      views: this.props.location.state.views,
      jobs: [],
      error: '',
      messages: '',
      isHidden: true,
      isEmployer: this.props.location.state.isEmployer,
      isLoggedIn: this.props.location.state.isLoggedIn,
      redirect: false,
      icon: false
    }

    // this.toggleView = this.toggleView.bind(this);
    this.handleTabPage = this.handleTabPage.bind(this);
    this.handleInbox = this.handleInbox.bind(this);
  }

  componentWillMount(){
    // console.log(this.props.location.state);
    // this.setState({isHidden: false});
    // console.log(this.state);
    API.getMessages(this.props.location.state._id).then((messages) => {
      this.setState({messages});
    }).catch((err) => {
      console.log(err);
    })

    if (this.state.isEmployer) {
      API.getMyPostedJobs(this.state.emailID).then((data) => {
        // console.log(data);
        if (data !== 404) {
            this.setState({jobs: data});
        }
      }).catch((err) => {
        this.setState({error: err});
      });
    } else {
      API.getMyAppliedJobs(this.state.emailID).then((response) => {
        // console.log(response);
        this.setState({jobs: response})
      }).catch((err) => {
        this.setState({error: err})
      });
      // this.setState({jobs: this.props.location.state.myjobs})
    }

  }

  handleInbox(event) {
    event.preventDefault();
    console.log(this.props.location.state);
    this.props.history.push({
      pathname: `/inbox`,
      state: {
        data: this.props.location.state,
        messages: this.state.messages
      }
    })
  }

  // toggleView() {
  //   this.setState(prevState => ({
  //     isHidden: !prevState.isHidden
  //   }));
  // }

  handleTabPage(tab) {
    // console.log(this.state);
    // let data = this.state;
    let profile = this.props.location.state.firstname.toLowerCase() + this.props.location.state.lastname.toLowerCase();
    // tab = tab.toLowerCase();
    // console.log(tab);
    if (tab === 'logout') {
      API.logout(this.props.location.state.tokens[0]).then((response) => {
        if (response === 200) {
          this.setState({redirect: true});
        }
      }).catch((err) => {
        console.log(err);
      })
    } else if (tab === 'profile') {
      this.props.history.push({
        pathname: `/in/${profile}`,
        state: this.props.location.state
      })
    } else if (tab === 'recruit') {
      this.props.history.push({
        pathname: `/${tab}`,
        state: this.props.location.state
      })
    } else {
      this.props.history.push({
        pathname: `/${tab}`,
        state: this.props.location.state
      })
    }
  }

  renderEmployerDashboard(){
    let inbox = 0;
    if (this.state.messages) {
      this.state.messages.map((value, index) => {
        if (!value.isRead) {
          inbox += 1
        }
      })
    }

    return (
      <div>
      <div className="container navbar">
          <Navbar
            onSearch={this.handleIt}
            status={this.state.isLoggedIn}
            data={this.props.location.state}
            type={this.props.location.state.isEmployer}
            chooseTab={this.handleTabPage} />
      </div>

      <div id="dash-main" style={{backgroundImage: `url(https://res.cloudinary.com/jobboard/image/upload/v1525997843/dash-back.jpg)`}}>
        <h1 className="text-center"><span id="one">One</span> stop to view and manage your workflow</h1>
      </div>

        <div className="container dashboard-content">
          {/* <div className="col-xs-12 panel panel-default text-center success-rate">
            <div className="panel-heading" id="success-rate-header">Your success rate</div>
            <div className="panel-body" id="show-success-rate"> %</div>
          </div> */}

          <div className="col-xs-12 text-center panel panel-body in-panel" onClick={this.handleInbox}>
            <h3>Inbox</h3>
            <hr />
            <h1 className="enlarge"><i className="fa fa-envelope-o" /></h1>
            <h4>0 total messages</h4>
            {inbox === 0 ? null : <h4>{inbox} unread message(s)</h4>}
          </div>

          <div className="col-xs-12 panel panel-body col-md-6 in-panel" onClick={() => this.handleTabPage('recruit')}>
            <h4 className="text-center">Jobs posted</h4>
            <hr />
            {this.state.jobs.length ? <span className="text-center"><h1 className="enlarge"><i className="fa fa-briefcase" /></h1><h1>{this.state.jobs.length}</h1></span> : <p className="alert alert-info"><i className="fa fa-info-circle fa-lg" /> You have not posted a job yet.</p>}
            {/* <div className="panel-body text-center col-xs-12" id="posted-jobs-list">
              {this.state.jobs.length ?
                // <div>
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th className="">Status</th>
                      <th className="">Job</th>
                      <th className="">Applicants</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.jobs.map((value, index) => (
                      <tr key={index}>
                        {value.status === 'Open' ? <td><span className="badge badge-success">Open</span></td> : <td><span className="badge badge-danger">Closed</span></td> }
                        <td className="posted-job">{value.designation}</td>
                        {value.applied.length ? <td><span className="badge badge-info">{value.applied.length}</span> <a onClick={() => this.handleTabPage('recruit')}><i className="fa fa-external-link pull-right" /></a></td> :
                        <td><span className="badge badge-info">0</span> <a className="disabled-link"><i className="fa fa-external-link pull-right" /></a></td> }
                      </tr>
                    ))}
                  </tbody>
                </table> : <p className="alert alert-info"><i className="fa fa-info-circle fa-lg" /> You have not posted a job yet.</p>
              }

            </div> */}
          </div>

          <div className="col-xs-12 panel panel-body pull-right text-center col-md-6 profile-views in-panel">
            <h4 className="text-center">Profile views</h4>
            <hr />
            <h1 className="enlarge"><i className="fa fa-eye" /></h1>
            <h1>{this.state.views}</h1>
          </div>


        </div>
      </div>
    // </div>
    )
  }


  render() {
    // console.log(this.state.jobs);
    if (this.state.redirect) {
      return <Redirect to="/" />
    }
    if (this.state.jobs && !this.state.error && this.state.isEmployer) {
      return this.renderEmployerDashboard();
    } else if (this.state.error) {
      return (
        <div>
          <Navbar
            onSearch={this.handleIt}
            status={this.state.isLoggedIn}
            data={this.props.location.state}
            type={this.props.location.state.isEmployer}
            chooseTab={this.handleTabPage} />
            <h3>No jobs posted yet</h3>
        </div>
      );
    } else if (this.state.jobs && !this.state.error && !this.state.isEmployer) {
      let applied = this.state.jobs.length;
      let accepted = 0;
      this.state.jobs.map((value, index) => {
        if (value.status === 'Accepted') {
          accepted += 1;
        }
      });

      let success_rate = parseInt((accepted / applied) * 100);
      // console.log(success_rate);
      if (isNaN(success_rate)) {
        success_rate = 0;
      }

      let inbox = 0;
      if (this.state.messages) {
        this.state.messages.map((value, index) => {
          if (!value.isRead) {
            inbox += 1
          }
        })
      }

      // document.getElementById("data").innerHTML = success_rate;

      return (
        // <div id="dash-main">
        <div>
        <div className="container navbar">
          {/* <div className="navbar"> */}
            <Navbar
              onSearch={this.handleIt}
              status={this.state.isLoggedIn}
              data={this.props.location.state}
              chooseTab={this.handleTabPage} />
        </div>



          <div id="dash-main" style={{backgroundImage: `url(https://res.cloudinary.com/jobboard/image/upload/v1525997843/dash-back.jpg)`}}>
            <h1 className="text-center"><span id="one">One</span> stop to view and manage your workflow</h1>
          </div>

          <div id="dash">
          <div className="container dashboard-content">
            {/* <div className="col-xs-12 col-md-6 panel panel-body text-center inbox-panel gap">
              <h4>Your projected success rate</h4>
              <hr />
              <div id="show-success-rate">{success_rate} %</div>
            </div> */}
            <div className="col-xs-12 col-md-6 text-center panel panel-body success-panel" >
              <h3>Projected success rate</h3>
              <hr />
              <h1 className="enlarge"><i className="fa fa-line-chart" /></h1>
              <h1>{success_rate} %</h1>
            </div>

            <div className="col-xs-12 col-md-6 panel panel-body pull-right text-center applied-jobs jobs-panel">
              <h3>Jobs applied</h3>
              <hr />
              <h1><i className="fa fa-suitcase" /> &nbsp;&nbsp;&nbsp;{this.state.jobs.length}</h1>
              <div className="panel-body text-center" id="jobs-list">
                {this.state.jobs.length ?
                  <span>
                  {this.state.jobs.map((value, index) => (
                    <div key={index} className="row">
                      <h4 className="col-xs-8 col-md-8">{value.job} - {value.company}</h4>
                      {value.status === 'Pending' ? <h4 className="col-xs-3 badge badge-info">{value.status}</h4> : null }
                      {value.status === 'Accepted' ? <h4 className="col-xs-3 badge badge-success">{value.status}</h4> : null }
                      {value.status === 'Rejected' ? <h4 className="col-xs-3 badge badge-danger">{value.status}</h4> : null }
                    </div>
                  ))}</span> : <p className="alert alert-info"><i className="fa fa-info-circle fa-lg" /> You have not applied to any jobs yet.</p>
                }

              </div>
            </div>

            <div className="col-xs-12 col-md-6 text-center panel panel-body pull-right profile-views view-panel gap">
              <h3>Profile views</h3>
              <hr />
              <h1 className="enlarge"><i className="fa fa-eye" /></h1>
              {/* <div className=""><p>{this.state.views}</p></div> */}
              <h1>{this.state.views}</h1>
            </div>

            <div className="col-xs-12 col-md-6 text-center panel panel-body inbox-panel" onClick={this.handleInbox}>
              <h3>Inbox</h3>
              <hr />
              <h1 className="enlarge"><i className="fa fa-envelope-o" /></h1>
              <h4>{this.state.messages.length} total messages</h4>
              {inbox === 0 ? null : <h4>{inbox} unread message(s)</h4>}
            </div>

            {/* <div id="success-rate">

            </div> */}
          </div>
        </div>
      </div>


      )
    }
  }
}

export default Dashboard;
