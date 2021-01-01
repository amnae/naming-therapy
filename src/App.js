//import logo from './logo.svg';
import React, { Component } from 'react';
import './App.css';
import Card from './Card/Card';
import DrawButton from "./DrawButton/DrawButton";
import firebase from 'firebase/app';
import 'firebase/database';

import { DB_CONFIG } from './Config/Firebase/db_config';

//to do 

class App extends Component {
  constructor(props){
    super(props);

    if (!firebase.apps.length) {
       this.app = firebase.initializeApp(DB_CONFIG);
    } else {
       this.app = firebase.app(); // if already initialized, use that one
    }
    
    this.database = this.app.database().ref().child('spanish ex');

    this.updateCard = this.updateCard.bind(this);
    
    this.state = {
        cardList: [],
        currentCard: {},
        topic: "",
        numCards: 30,
        hints:[],
        currentIndex:0,
        topicList: [],
        main:0
    }
  }
  
  componentWillMount(){
    const currentCards = this.state.cardList;
    this.database.once('value').then((snapshot) => {
      let tempArray = [];
      snapshot.val().map((item) => tempArray.push(item['list'])); 
      this.setState({
        topicList: [...new Set(tempArray)] 
      })
  })
    
    this.database.on('child_added', snapshot => {
        currentCards.push({
            id: snapshot.key,
            spanish: snapshot.val().spanish,
            english: snapshot.val().english,
            topic:snapshot.val().list
        })
        
        this.setState({
          cardList: currentCards,
          currentCard: this.getRandomCard(currentCards)
        })
    });
    console.log(this.state);
  }
  
  getRandomCard(currentCards){
    var card = currentCards[Math.floor(Math.random() * currentCards.length)];
    return card;
  }
  
  updateCard(){
    const currentCards = this.state.cardList;
    this.setState({
      currentCard: this.getRandomCard(currentCards)
    })
  }
  
  
  flashCards() {
    return (
      <div className="main">
        <div className="cardRow">
          <Card eng={this.state.currentCard.english} 
                ara={this.state.currentCard.spanish} 
                />
        </div>
        <div className="buttonRow">
          <DrawButton drawCard={this.updateCard}/>
        </div>
      </div>
    );
  }
  
  goToFlashCards(){
    console.log(this.state);
    console.log(this.state.cardList);
    if(!(this.state.cardList.length&this.state.topicList.length)){
        console.log(1)
        return;//something is wrong with database
    }
    if(!this.state.topic){
        console.log(2);
        return;//topic not chosen
    }
    if(!(this.state.numCards>0)){
        console.log(3);
        return;//invalid card number
    }
    console.log(4);
    this.setState({main:1});
  }
  
  chooseListAndNumber(){
    return (
      <div className="main">
        <div className="chooseList">
            Which topic would you like to use?:
           <ul>
              {this.state.topicList.map((topic)=> { 
                return(<li id={topic} onClick={()=>this.setState({topic})}> {topic} </li>)
              })}
          </ul>
        </div>
        
        <div className="howMany">
          <label>
            How many words would you like to choose?
            <input name="numCards" type="number" value={this.state.numCards} onChange={(event)=>this.setState({numCards:event.target.value})}/>
          </label>
        </div>
        
        <div className="button">
          <button className="btn" onClick={()=>this.goToFlashCards()}>Go to words</button>
        </div>
      </div>
    );
  }
  
  
  render() {
    return (
      <div className="app">
      {this.state.main? this.flashCards(): this.chooseListAndNumber()}
      </div>
    );
  }
}

export default App;
