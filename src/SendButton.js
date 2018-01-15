import React, { Component } from 'react';
import {RaisedButton, FlatButton, Dialog, TextField} from 'material-ui';
import './App.css';

class SendButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      destination: '',
      memo: '',
      amount: 0,
      error: '',
      success: '',
      labelText: 'Submit',
      disabled: false
    };

    this.sendAsset = this.sendAsset.bind(this);
  }

  sendAsset() {
    this.setState({labelText: 'Loading', disabled: true})
    try {
      var asset = window.StellarSDK.Asset.native();
      if (!this.props.native) {
        asset = new window.StellarSDK.Asset(this.props.assetCode, this.props.issuer);
      }
      this.props.server.loadAccount(this.props.pair.publicKey())
        .then(function(account) {
          var transaction = new window.StellarSDK.TransactionBuilder(account)
          .addOperation(window.StellarSDK.Operation.payment({
            asset: asset,
            destination: this.state.destination,
            amount: this.state.amount
          }))
          .addMemo(window.StellarSDK.Memo.text(this.state.memo))
          .build();
  
          transaction.sign(this.props.pair);
          return this.props.server.submitTransaction(transaction);
        }.bind(this))
        .then(function(result) {
          this.setState({
            labelText: "Success!",
            success: "Sucess! You can close the window now",
            error: ''
          });
        }.bind(this))
        .catch(function(error) {
          console.log(error.message);
          this.setState({error: error.message, labelText: 'Submit', disabled: false, success: ''});
        }.bind(this));
      
        this.props.refreshBalances();
    } catch(error) {
      console.log(error);
      this.setState({error: error.message});
    }
  }

  render() {
    var actions = [
      <FlatButton
        label="Close"
        default={true}
        onClick={() => {this.setState({open: false, labelText: 'Submit', disabled: false, error: '', success: ''});}}
      />,
      <FlatButton
        label={this.state.labelText}
        primary={true}
        onClick={this.sendAsset}
        disabled={this.state.disabled}
      />
    ];
    
    return (
      <div>
      <RaisedButton
        label="Send"
        primary={true}
        onClick={() => {this.setState({open: true});}}
      />
      <Dialog
        title={"Send " + this.props.assetCode}
        actions={actions}
        open={this.state.open}
        modal={false}
        onRequestClose={() => {this.setState({open: false, labelText: 'Submit', error: '', success: '', disabled: false})}}
      >
        <h3><b>Current Balance:</b> {this.props.amount}</h3>
        <br />
        <br />
        Sending an asset will cost 0.00001 lumens.
        <p style={{color: '#ff5468'}}>
          {this.state.error}
        </p>
        <p style={{color: '#42f47a'}}>
          {this.state.success}
        </p>
        <TextField
          hintText="(e.g. GDYKNZMYT6NE5EX6H3YZFGXMQ3R6NFR3YPX5RVM3L3DAK6RSA7KJI6CA)"
          floatingLabelText="Destination"
          fullWidth={true}
          onChange={(event) => {this.setState({destination: event.target.value});}}
        />
        <TextField
          hintText="(e.g. Hi Friends! Welcome to Stellar)"
          floatingLabelText="Memo (Optional)"
          fullWidth={true}
          onChange={(event) => {this.setState({memo: event.target.value});}}
        />
        <TextField
          floatingLabelText="Amount"
          fullWidth={true}
          type="number"
          onChange={(event) => {this.setState({amount: event.target.value});}}
        />
      </Dialog>
      </div>
    );
  }
}

export default SendButton;