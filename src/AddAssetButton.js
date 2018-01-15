import React, { Component } from 'react';
import {RaisedButton, FlatButton, Dialog, TextField} from 'material-ui';
import './App.css';

class AddAssetButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      assetCode: '',
      issuingAccount: '',
      limit: 0,
      error: ''
    };

    this.addNewAsset = this.addNewAsset.bind(this);
  }

  addNewAsset() {
    try {
      var asset = new window.StellarSDK.Asset(this.state.assetCode, this.state.issuingAccount);
      this.props.server.loadAccount(this.props.pair.publicKey())
        .then(function(account) {
          var transaction = new window.StellarSDK.TransactionBuilder(account)
          .addOperation(window.StellarSDK.Operation.changeTrust({
            asset: asset,
            limit: this.state.limit 
          }))
          .build();
  
          transaction.sign(this.props.pair);
          this.props.server.submitTransaction(transaction);
        }.bind(this));
      
   
      this.setState({open: false});
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
        onClick={() => {this.setState({open: false});}}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.addNewAsset}
      />
    ];
    
    return (
      <div>
      <RaisedButton
        label="+ Add a New Asset (Trustline)"
        primary={true}
        onClick={() => {this.setState({open: true});}}
      />
      <Dialog
        title="Add New Asset"
        actions={actions}
        open={this.state.open}
        modal={false}
        onRequestClose={() => {this.setState({open: false})}}
      >
        Each added trustline will cost 0.00001 lumens.
        <p style={{color: '#ff5468'}}>
          {this.state.error}
        </p>
        <TextField
          floatingLabelText="Asset Code"
          fullWidth={true}
          onChange={(event) => {this.setState({assetCode: event.target.value});}}
        />
        <TextField
          hintText="(e.g. GDYKNZMYT6NE5EX6H3YZFGXMQ3R6NFR3YPX5RVM3L3DAK6RSA7KJI6CA)"
          floatingLabelText="Issuing Account"
          fullWidth={true}
          onChange={(event) => {this.setState({issuingAccount: event.target.value});}}
        />
        <TextField
          floatingLabelText="Limit"
          fullWidth={true}
          type="number"
          onChange={(event) => {this.setState({limit: event.target.value});}}
        />
      </Dialog>
      </div>
    );
  }
}

export default AddAssetButton;