import React, { Component } from 'react';
import './Card.css';

//function Card 

const Card = (props) => (
  <div className="card-container">
    <div className="card">
      <div className="front">
        <div className="english">
          {props.eng}
        </div>
      </div>
      <div className="back">
        <div className="arabic">
          {props.ara}
        </div>
      </div>
    </div>
  </div>
)

export default Card;