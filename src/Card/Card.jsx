import React, { Component } from 'react';
import './Card.css';

//function Card [image, audio, english, spanish]

class Card extends Component { 

  constructor(props) {
    super(props);
    this.state = {
      visibility: false,
    };
  }
  
 render() {
  const visibility = !this.state.visibility;
  return (
  <div className="card-container">
    <div className="card" onClick={() => this.setState({visibility})}>
      <div className="half">
        <div className="english">
          {this.props.eng}
        </div>
      </div>
      <div className="half">
        <div className="arabic">
        <div className = {this.state.visibility? 'show' : 'hidden'}>
          {this.props.ara}
        </div>
        </div>
      </div>
    </div>
  </div>
)
}
}

export default Card;