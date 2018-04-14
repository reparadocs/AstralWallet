import React, { Component } from 'react';
import {MuiThemeProvider} from 'material-ui';
import Start from './Start.js';
import Wallet from './Wallet.js';
import EmptyWallet from './EmptyWallet.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pair: null,
      publicKey: null,
      privateKey: null,
      testnet: false,
      server: null,
      balances: [],
      error: false,
      walletEmpty: false
    };

    this.initializeWallet = this.initializeWallet.bind(this);
    this.refreshBalances = this.refreshBalances.bind(this);
  }

  refreshBalances() {
    this.state.server.loadAccount(this.state.publicKey).then(function(account) {
      this.setState({
        balances: account.balances,
      });
    }.bind(this)); 
  }

  initializeWallet(privateKey, testnet) {
    if (testnet) {
      window.StellarSDK.Network.useTestNetwork();
    } else {
      window.StellarSDK.Network.usePublicNetwork();
    }
    try {
      var serverURL = testnet ? 'https://horizon-testnet.stellar.org' : 'https://horizon.stellar.org';
      var pair = window.StellarSDK.Keypair.fromSecret(privateKey);
      var server = new window.StellarSDK.Server(serverURL);
      server.loadAccount(pair.publicKey()).then(function(account) {
        this.setState({
          balances: account.balances,
          pair: pair,
          publicKey: pair.publicKey(),
          privateKey: privateKey,
          testnet: testnet,
          server: server,
          walletEmpty: false
        });
      }.bind(this))
      .catch(function(error) {
        this.setState({
          publicKey: pair.publicKey(),
          privateKey: privateKey,
          testnet: testnet,
          server: server,
          walletEmpty: true
        });
      }.bind(this));
    } catch (error) {
      console.log(error.message);
      this.setState({error: true});
    };
  }

  render() {
    var displayComponent = null;
    if (this.state.privateKey == null) {
      displayComponent = 
        <Start 
          initializeWallet={this.initializeWallet}
          error={this.state.error}
        />;
    } else if (this.state.walletEmpty) {
      displayComponent = 
        <EmptyWallet
          publicKey={this.state.publicKey}
          privateKey={this.state.privateKey}
          testnet={this.state.testnet}
          initializeWallet={this.initializeWallet}
        />
    } else {
      displayComponent = 
        <Wallet 
          balances={this.state.balances}
          publicKey={this.state.publicKey}
          refreshBalances={this.refreshBalances}
          pair={this.state.pair}
          server={this.state.server}
        />;
    }
    return (
      <MuiThemeProvider>
        {displayComponent}
      </MuiThemeProvider>
    );
  }
}

export default App;
