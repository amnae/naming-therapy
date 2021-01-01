//import logo from './logo.svg';
import React, { Component } from 'react';
import './App.css';
import Card from './Card/Card';
import DrawButton from "./DrawButton/DrawButton";
import firebase from 'firebase/app';
import 'firebase/database';

import { DB_CONFIG } from './Config/Firebase/db_config';

class App extends Component {
  constructor(props){
    super(props);

    if (!firebase.apps.length) {
       this.app = firebase.initializeApp(DB_CONFIG);
    } else {
       this.app = firebase.app(); // if already initialized, use that one
    }
    
    this.database = this.app.database().ref().child('words');

    this.updateCard = this.updateCard.bind(this);
    
    this.state = {
        cards: [],
        currentCard: {}
    }
  }
  
  componentWillMount(){
    const currentCards = this.state.cards;
    
    this.database.on('child_added', snapshot => {
        currentCards.push({
            id: snapshot.key,
            arabic: snapshot.val().arabic,
            english: snapshot.val().english
            
        })
        
        this.setState({
          cards: currentCards,
          currentCard: this.getRandomCard(currentCards)
        })
    });
    
  }
  
  getRandomCard(currentCards){
    var card = currentCards[Math.floor(Math.random() * currentCards.length)];
    console.log(currentCards.length);
    console.log(card);
    return card;
  }
  
  updateCard(){
    const currentCards = this.state.cards;
    this.setState({
      currentCard: this.getRandomCard(currentCards)
    })
  }
  
  render() {
    return (
      <div className="App">
        <div className="cardRow">
          <Card eng={this.state.currentCard.english} 
                ara={this.state.currentCard.arabic} 
                />
        </div>
        <div className="buttonRow">
          <DrawButton drawCard={this.updateCard}/>
        </div>
      </div>
    );
  }
}

export default App;
