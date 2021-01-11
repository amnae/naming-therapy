//import logo from './logo.svg';
import React, { Component } from 'react';
import './App.css';
import Card from './Card/Card';
import DrawButton from "./DrawButton/DrawButton";
import firebase from 'firebase/app';
//import MetaTags from 'react-meta-tags';
import 'firebase/database';
import Container from "react-bootstrap/Container";

import { DB_CONFIG } from './Config/Firebase/db_config';

//give heroku access to db without it going on github

function shuffleArray(array) {
  let i = array.length - 1;
  for (; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

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
    this.database.once('value').then((snapshot) => {
      let tempArray = [];
      snapshot.val().map((item) => tempArray.push(item['list'])); 
      this.setState({
        topicList: [...new Set(tempArray)] 
      })
  })
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
  
  //center the top buttons
  //center the bottom button
  //card not go around
  //click first letter -  first letter appears above word
  //click written word - replaced by whole word
  //click word audio - plays sound
  flashCards() {
    return (
      <div className="main">
        <div className="container">
        
          <div className="row">  

            <div className="hintBtn">
              <button className="btn" onClick={this.drawCard}>First Letter</button>
            </div>
            <div className="hintBtn">
              <button className="btn" onClick={this.drawCard}>Written Word</button>
            </div>
            <div className="hintBtn">
              <button className="btn" onClick={this.drawCard}>Word Audio</button>
            </div>
          </div>
          
          <div className="row">        
            <div className="cardRow">
              <Card eng={this.state.currentCard.english} 
                    ara={this.state.currentCard.spanish} 
                    />
            </div>
          </div>
            
          <div className="row">        
              <DrawButton drawCard={this.updateCard}/>
          </div>
          
        </div>
      </div>
    );
  }
  
  goToFlashCards(){
    console.log(this.state);
    console.log(this.state.cardList);
    if(!this.state.topic){
        console.log(2);
        return;//topic not chosen
    }
    if(!(this.state.numCards>0)){
        console.log(3);
        return;//invalid card number
    }
    this.setState({cardList:[]});
    
    //get the words in that topic and pic numCards of them or all of them. Have note at top first to okay or not.
    this.database.orderByChild('list').equalTo(this.state.topic)
      .once("value", function(querySnapshot) {
        let tempArray = []
        querySnapshot.forEach(function(doc) {
            console.log(doc.val());
            tempArray.push(doc.val());
        });
        let tempArray2 = shuffleArray(tempArray);
        console.log(this.state);
        let numCards=this.state.numCards;
        this.setState({ cardList: tempArray2.slice(0,numCards), main:1},
         () => {this.updateCard()});
    }.bind(this));
  }
  
  chooseListAndNumber(){
    console.log(this.state.topic);
    return (
      <div className="chooseListAndNumber">  
      
        <h3> Word Cards </h3>

          <div className="topicButtonGroup">
            <div> Which topic would you like to use?  </div>
          
            <div className="btn-group-vertical indent">
              {this.state.topicList.map((topic)=> { 
                return( <input type="button" className = {this.state.topic === topic ? "item chosen btn" : "item btn"} key={topic} onClick={()=>this.setState({topic}) } value={topic}/>)
              })}
            </div>       
          </div>  
          
          <br />

          <div> How many words would you like to choose? </div>
            <input name="numCards" type="number" value={this.state.numCards} onChange={(event)=>this.setState({numCards:event.target.value})} className="indent"/>

          <div className="button center">
                    <br />
              <input type="button" className="btn" onClick={()=>this.goToFlashCards()} value= "Go to words"/>

          </div>

      </div>

    );
  }
  
  
  render() {
      console.log(this.state.main);

    return (
    <div className="h100">

      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"/>
      <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
      
          {this.state.main? this.flashCards(): this.chooseListAndNumber()}
          
    </div>
    );
  }
}

export default App;
