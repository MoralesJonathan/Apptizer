import React, { Component } from "react";
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Card } from '../../components/Card/Card.jsx';
export class UserCard extends Component {
  render() {
    return (
      <div className="content">
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

export default UserCard;
