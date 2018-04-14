import React, { Component } from 'react';
import {Table, TableHeader, TableRow, TableRowColumn, TableFooter, TableBody, TableHeaderColumn, RaisedButton, FlatButton} from 'material-ui';
import './App.css';
import AssetIssuerButton from './AssetIssuerButton.js';
import AddAssetButton from './AddAssetButton.js';
import AddStockButton from './AddStockButton.js';

import SendButton from './SendButton.js';

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideZero: false,
    };
  }

  render() {
    var balanceBody = [];
    var hideZero = this.state.hideZero;
    this.props.balances.forEach(function(balance) {
      var native = balance.asset_type === 'native' ? true : false;
      var balanceCode = balance.asset_type === 'native' ? "XLM" : balance.asset_code;
      var limit = balance.asset_type === 'native' ? "∞" : parseFloat(balance.limit).toString();
      var issuer = balance.asset_issuer ? 
        <AssetIssuerButton 
          label={balance.asset_issuer.substring(0,6)} 
          dialogText={balance.asset_issuer}
          assetCode={balanceCode}
        /> 
        : <FlatButton disabled={true} label="None" />;
      if (!hideZero || parseFloat(balance.balance) > 0.000001) {
        balanceBody.push(
          <TableRow key={balance.asset_code}>
            <TableRowColumn>{balanceCode}</TableRowColumn>
            <TableRowColumn>{balance.balance}</TableRowColumn>
            <TableRowColumn>{limit}</TableRowColumn>
            <TableRowColumn>{issuer}</TableRowColumn>
            <TableRowColumn>
              <SendButton 
                native={native}
                assetCode={balanceCode}
                issuer={balance.asset_issuer}
                server={this.props.server}
                pair={this.props.pair}
                amount={balance.balance}
                refreshBalances={this.props.refreshBalances}
              />
            </TableRowColumn>
          </TableRow>
        );
      }
    }.bind(this));
    return (
      <div className="App">
        <header className="App-header">
          <h1><span role="img" aria-label="rocket">🚀</span></h1>
          <h1 className="App-title">Astral Wallet</h1>
        </header>

        <h1>Public Key: {this.props.publicKey}</h1>
        <Table 
          selectable={false}
        >
          <TableBody
            displayRowCheckbox={false}
          >
            <TableRow>
              <TableRowColumn>
                <AddAssetButton
                  pair={this.props.pair}
                  server={this.props.server}
                  refreshBalances={this.props.refreshBalances}
                />
              </TableRowColumn>
               <TableRowColumn>
                <AddStockButton
                  pair={this.props.pair}
                  server={this.props.server}
                  refreshBalances={this.props.refreshBalances}
                />
              </TableRowColumn>
              <TableRowColumn>
                <RaisedButton
                  label="Refresh Balances"
                  secondary={true}
                  onClick={() => {this.props.refreshBalances();}}
                />
              </TableRowColumn>
              <TableRowColumn>
              <RaisedButton
                label="Hide/Unhide Zero Balances"
                default={true}
                onClick={() => {this.setState({hideZero: !this.state.hideZero});}}
              />
              </TableRowColumn> 
            </TableRow> 
          </TableBody>
      </Table>
      <Table
        selectable={false}
      >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>Asset Code</TableHeaderColumn>
            <TableHeaderColumn>Amount</TableHeaderColumn>
            <TableHeaderColumn>Limit</TableHeaderColumn>
            <TableHeaderColumn>Issuer (First 6, click to show full)</TableHeaderColumn>
            <TableHeaderColumn />
          </TableRow>
        </TableHeader>
        <TableBody            
          displayRowCheckbox={false}
          showRowHover={true}
        >
          {balanceBody}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableRowColumn />
          </TableRow>
        </TableFooter>
      </Table>
      </div>
    );
  }
}

export default Wallet;
