import React, { Component } from 'react';
import './DrawButton.css';

class DrawButton extends Component {
  constructor(props){
    super(props);
    
    this.drawCard=this.drawCard.bind(this);
    
    this.state = {
    }
  }
  
  drawCard(){
    this.props.drawCard();
  }
  
  render(props){
    return(
      <div className="buttonContainer">
        <button className="drawbtn" onClick={this.drawCard}>Draw Card</button>
      </div>
    )
  }
}

export default DrawButton;