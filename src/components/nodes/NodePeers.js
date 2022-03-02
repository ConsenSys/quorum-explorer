import React, { Component } from 'react';
import {Container, Row, Col, Card} from 'react-bootstrap';
import { PeopleFill } from 'react-bootstrap-icons';
const nodesConfig = require('../../config/nodes.json');

function NodePeers(props){

  const node = props.node;
  const peers = props.peers;

  return (
    <Card >
      <Card.Body>
        <Row className="cCenterAlign">
          <Col sm={4}>
            <PeopleFill color="DimGray" size={48} />
          </Col>
          <Col sm={8} >
            <Card.Title>Peers</Card.Title>
            <Card.Text>{peers}</Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

}

export default NodePeers;



