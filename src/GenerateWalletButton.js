import React, { Component } from 'react';
import {RaisedButton, FlatButton, Dialog} from 'material-ui';
import './App.css';

class GenerateWalletButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      pair: null    
    };
  }

  componentDidMount() {
    this.setState({
      pair: window.StellarSDK.Keypair.random()
    });
  }

  addFunds() {
    fetch('https://horizon-testnet.stellar.org/friendbot?addr=' + this.state.pair.publicKey())
      .then((error, response, body) => {
        if (error || response.statusCode !== 200) {
          console.log("friendbot failed :(");
          console.log(error.message);
        } else {
          console.log("add test funds success!");
        }
      })
  }

  render() {
    var actions = [
      <FlatButton
        label="Close"
        default={true}
        onClick={() => {this.setState({open: false});}}
      />,
      <FlatButton
        label="Add Test Funds and Go (TestNet)"
        primary={true}
        onClick={() => {
          this.addFunds();
          this.props.initializeWallet(this.state.pair.secret(), true);
        }}
      />,
      <FlatButton
        label="Go (MainNet)"
        primary={true}
        onClick={() => {this.props.initializeWallet(this.state.pair.secret(), false);}}
      />
    ];
    
    return (
      <div>
      <RaisedButton
        onClick={() => {this.setState({open: true})}}
        label="Generate Wallet"
        default={true}
        backgroundColor="#2cc15b"
        labelColor="white"
        style={{marginTop: 30}}
      />
      <Dialog
        title="Generate Wallet"
        actions={actions}
        open={this.state.open}
        modal={false}
        onRequestClose={() => {this.setState({open: false})}}
      >
        <b>Secret Key (SAVE THIS!):</b> {this.state.pair ? this.state.pair.secret() : "Loading"}
        <br />
        <br />
        <br />
        <b>Public Key:</b> {this.state.pair ? this.state.pair.publicKey(): "loading"}
      </Dialog>
      </div>
    );
  }
}

export default GenerateWalletButton;