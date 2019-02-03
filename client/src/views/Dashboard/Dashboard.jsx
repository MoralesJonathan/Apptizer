import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Card } from '../../components/Card/Card.jsx';
import { StatsCard } from '../../components/StatsCard/StatsCard.jsx';
import axios from 'axios';

class Dashboard extends Component {
  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json['names'].length; i++) {
      var type = 'fa fa-circle text-' + json['types'][i];
      legend.push(<i className={type} key={i} />);
      legend.push(' ');
      legend.push(json['names'][i]);
    }
    return legend;
  }
  updateBusinessDetails = e => {
    e.preventDefault();
    console.log(e.currentTarget);
    let data = {};
    data.appName = document.getElementById('formBasicTitle').value;
    data.state = { restaurantName: document.getElementById('formBasicName').value};
    axios
      .post('/api/saveToDb', {
        body: data,
      })
      .then(res => {
        console.log(res);
        console.log(res.data);
      });
  };

  componentDidMount(){
    axios.get('/api/loadAppConfig').then(res => {
      // this.setState({ res });
      console.log(res)
    });
  }
  render() {
    return (
      <div className="content">
        <Row>
          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-server text-warning" />}
              statsText="Total Size"
              statsValue="13.5Mb"
              statsIcon={<i className="fa fa-refresh" />}
              statsIconText="Updated now"
            />
          </Col>
          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-wallet text-success" />}
              statsText="Loyalty signups "
              statsValue="53"
              statsIcon={<i className="fa fa-calendar-o" />}
              statsIconText="Last day"
            />
          </Col>
          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-graph1 text-danger" />}
              statsText="Total hits"
              statsValue="7253"
              statsIcon={<i className="fa fa-clock-o" />}
              statsIconText="In the last week"
            />
          </Col>
          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-way text-info" />}
              statsText="Version"
              statsValue="0.4.2"
              statsIcon={<i className="fa fa-refresh" />}
              statsIconText="Updated now"
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card
              id="chartHours"
              title="Basic Business Details"
              content={
                <Form onSubmit={this.updateBusinessDetails}>
                  <Form.Group controlId="formBasicName">
                    <Form.Label>Restaurant Name</Form.Label>
                    <Form.Control type="text" id="formBasicName" name="restaurantName" placeholder="Enter name of restaurant" />
                    <Form.Text className="text-muted">This will be used across the app.</Form.Text>
                  </Form.Group>
                  <Form.Group controlId="formBasicTitle">
                    <Form.Label>Restaurant App Name</Form.Label>
                    <Form.Control type="text" id="formBasicTitle" name="appName" placeholder="Enter name for the app" />
                  </Form.Group>
                  <Form.Group controlId="formBasicLogo">
                    <Form.Label>Restaurant Logo</Form.Label>
                    <Form.Control type="file" name="logo" accept="image/*" />
                  </Form.Group>
                  <Form.Group controlId="formBasicChecbox">
                    <Form.Check type="checkbox" label="Have multiple locations" />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Save
                  </Button>
                </Form>
              }
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
