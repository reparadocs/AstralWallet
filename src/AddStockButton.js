import React, { Component } from 'react';
import {RaisedButton, FlatButton, Dialog, TextField} from 'material-ui';
import './App.css';

class AddStockButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      assetCode: '',
      error: ''
    };

    this.addNewAsset = this.addNewAsset.bind(this);
  }

  addNewAsset() {
    try {
      var asset = new window.StellarSDK.Asset(this.state.assetCode, 'GDDDNMONFZYIQXWFULNTD765BNUTIIUU46GWMUNIMPQ6FQ5DUSK4EK74');
      this.props.server.loadAccount(this.props.pair.publicKey())
        .then(function(account) {
          var transaction = new window.StellarSDK.TransactionBuilder(account)
          .addOperation(window.StellarSDK.Operation.changeTrust({
            asset: asset,
            limit: '10000'
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
        label="+ Add a Stock"
        primary={true}
        onClick={() => {this.setState({open: true});}}
      />
      <Dialog
        title="Add New Stock"
        actions={actions}
        open={this.state.open}
        modal={false}
        onRequestClose={() => {this.setState({open: false})}}
      >
        Each added stock will cost 0.00001 lumens.
        <p style={{color: '#ff5468'}}>
          {this.state.error}
        </p>
        <TextField
          floatingLabelText="Stock Ticker"
          fullWidth={true}
          onChange={(event) => {this.setState({assetCode: event.target.value});}}
        />
      </Dialog>
      </div>
    );
  }
}

export default AddStockButton;