import React, { Component } from 'react';
import {RaisedButton, FlatButton, Dialog} from 'material-ui';
import './App.css';

class AssetIssuerButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    var closeAction = 
      <RaisedButton
        label="Close"
        primary={true}
        onClick={() => {this.setState({open: false});}}
      />;

    return (
      <div>
      <FlatButton
        onClick={() => {this.setState({open: true})}}
        label={this.props.label}
      />
      <Dialog
        title={"Asset Issuer for " + this.props.assetCode}
        actions={[closeAction,]}
        open={this.state.open}
        modal={false}
        onRequestClose={() => {this.setState({open: false})}}
      >
        {this.props.dialogText}
      </Dialog>
      </div>
    );
  }
}

export default AssetIssuerButton;