import React, { Component } from 'react';
import {TextField, RaisedButton} from 'material-ui';
import './App.css';
import GenerateWalletButton from './GenerateWalletButton.js';

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: null,
    };

    this.onChange = this.onChange.bind(this);
  }

  onSubmit(testnet) {
    this.props.initializeWallet(this.state.privateKey, testnet);
  }

  onChange(event) {
    this.setState({
      privateKey: event.target.value,
    });
  }

  render() {
    var errorText = null;
    if (this.props.error) {
      errorText = "Invalid Private Key, try again.";
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1><span role="img" aria-label="rocket">🚀</span></h1>
          <h1 className="App-title">Astral Wallet</h1>
          <a style={{color: 'white'}} href="https://github.com/reparadocs/AstralWallet">Github</a>
        </header>

        <TextField
          hintText="(e.g. SDYKNZMYT6NE5EX6H3YZFGXMQ3R6NFR3YPX5RVM3L3DAK6RSA7KJI6CA)"
          floatingLabelText="Private Key"
          style={{width: 800}}
          errorText={errorText}
          onChange={this.onChange}
        />
        <br />
        <RaisedButton
          label="Open Wallet"
          primary={true}
          style={{marginTop: 10}}
          onClick={() => {this.onSubmit(false);}}
        />
        <br />
        <RaisedButton
          label="Open TestNet Wallet"
          secondary={true}
          style={{marginTop: 30}}
          onClick={() => {this.onSubmit(true);}}
        />
        <br />
        <GenerateWalletButton
          initializeWallet={this.props.initializeWallet}
        />
      </div>
    );
  }
}

export default Start;
