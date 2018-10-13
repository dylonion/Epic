import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import './App.css';

import Header from './components/Header'
import Intropage from './components/Intropage'
import Dashboard from './components/Dashboard'
import DeckEditor from './components/DeckEditor'

class App extends Component {
  constructor() {
    super()
    this.state = {
      auth: false,
      user: null,
      apiError: null,
      decks: [],
      cards: []
    }

    this.getDecks = this.getDecks.bind(this)
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this)
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this)
    this.logout = this.logout.bind(this)
    this.deleteAccount = this.deleteAccount.bind(this)
  }

  getDecks() {
    fetch('/api/decks', {
      credentials: 'include',
    }).then(res => res.json())
    .then(res => {
      if(res.decks) {
        this.setState({
          decks: res.decks,
          cards: res.cards
        })
      }
    }).catch(err => console.log(err));
  }

  logout() {
    fetch('/api/auth/logout', {
      credentials: 'include',
    }).then(res => res.json())
      .then(res => {
        this.setState({
          auth: res.auth
        })
      }).catch(err => console.log(err));
  }

  handleLoginSubmit(e, data) {
    e.preventDefault();
    this.setState({
      apiError: null
    })
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    }).then(res => res.json())
        .then(res => {
          if(res.auth){
            this.setState({
              auth: res.auth,
              user: res.data.user
            })
            this.getDecks()
          }else{
            this.setState({
              apiError: 'User not found'
            })
          }
      }).catch(err => console.log(err));
  }

  deleteAccount() {
    let confirmDelete = window.prompt('Are you sure you want to delete this account? Type your username to confirm.')
    if(confirmDelete&& confirmDelete === this.state.user.username){
      fetch('/api/auth/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include'
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          auth: res.auth,
          user: res.data.user
        })
      })
    }
  }

  handleRegisterSubmit(e, data) {
    e.preventDefault();
    fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    }).then(res => res.json())
      .then(res => {
        if(res.error){
          if(res.error.code === 23505){
            this.setState({
              apiError: 'Error: Username already exists.'
            })
          }
        }else{
          this.setState({
            auth: res.auth,
            user: res.data.user
          })
        }
    }).catch(err => console.log(err))
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route path='/' render={(props) => {
            return (
              <Header
              />
            )
          }} />
          <Route exact path='/' render={(props)=> {
            return (
              this.state.auth ?
              <Redirect push to='/dashboard' /> :
                <Intropage
                  handleLoginSubmit={this.handleLoginSubmit}
                  handleRegisterSubmit={this.handleRegisterSubmit}
                  apiError={this.state.apiError}
                />
            )
          }}
          />
          <Route exact path='/deck-editor' render={(props) => {
            return (
              this.state.auth ?
              <DeckEditor
                user={this.state.user}
                decks={this.state.decks}
              /> :
              <Redirect push to='/' />
            )
          }}
          />
          <Route exact path='/dashboard' render={(props) => {
            return (
              this.state.auth ?
              <Dashboard user={this.state.user} /> :
              <Redirect push to="/" />
            )
          }} />
        </div>
      </Router>
    );
  }
}

export default App;
