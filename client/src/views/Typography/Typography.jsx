import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";

import Card from "../../components/Card/Card.jsx";

class Typography extends Component {
  render() {
    return (
      <div className="content">
          <Row>
            <Col md={12}>
              <Card
                title="Something"
                category="Coming soon"
                content={
                  <div>
                    
                  </div>
                }
              />
            </Col>
          </Row>
      </div>
    );
  }
}

export default Typography;
