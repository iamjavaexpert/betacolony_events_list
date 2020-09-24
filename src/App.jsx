import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

/** redux stuff added here */
import { Provider } from "react-redux";
import store from "./redux/stores";

/** External CSS modules added here */
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

/** Import all required component here */
import PageLoading from "./components/PageLoading";
import EventList from './components/EventList';

import { getColonyNetworkClient, Network, getLogs, ColonyRole, getBlockTime   } from '@colony/colony-js';
import { Wallet, utils  } from 'ethers';
import { InfuraProvider } from 'ethers/providers';


const App = () => {
  
  useEffect(() => {
    // fetchData();
  }, []);

  async function fetchData() {
    const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
    const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;

    // Get a new Infura provider (don't worry too much about this)
    const provider = new InfuraProvider();

    // Get a random wallet
    // You don't really need control over it, since you won't be firing any trasactions out of it
    const wallet = Wallet.createRandom();
    // Connect your wallet to the provider
    const connectedWallet = wallet.connect(provider);

    // Get a network client instance
    const networkClient = await getColonyNetworkClient(
      Network.Mainnet,
      connectedWallet,
      MAINNET_NETWORK_ADDRESS,
    );

    // Get the colony client instance for the betacolony
    const colonyClient = await networkClient.getColonyClient(MAINNET_BETACOLONY_ADDRESS);

    const eventFilter = colonyClient.filters.PayoutClaimed();

    // Get the raw logs array
    const eventLogs = await getLogs(colonyClient, eventFilter);

    const parsedLogs = eventLogs.map(event => colonyClient.interface.parseLog(event));

    // console.log(parsedLogs);
    // parsedLogs.filter((item) => {
    //   console.log('item', item);
    // }); 

    const [singleLog] = parsedLogs;
   
    const token = new utils.BigNumber(
      singleLog.values.token
    ).toString();

    console.log('token', token);

    const humanReadableFundingPotId = new utils.BigNumber(
      singleLog.values.fundingPotId
    ).toString();

    console.log('FundingPotId', humanReadableFundingPotId)
    const {
      associatedTypeId,
    } = await colonyClient.getFundingPot(humanReadableFundingPotId);

    const { recipient: userAddress } = await colonyClient.getPayment(associatedTypeId);    
    console.log('userAddress', userAddress);

    const humanReadableAmount = new utils.BigNumber(singleLog.values.amount);

    console.log('amount', humanReadableAmount.toString());

    const wei = new utils.BigNumber(10);

    // The converted amount is the human readable amount divided by the wei value raised to the power of 18
    const convertedAmount = humanReadableAmount.div(wei.pow(18));

    // If you are confident that it's a low enough value, you can display it as an integer -- .toNumber()
    // But to be on the safe side, you can also use it as a string
    console.log('token', convertedAmount.toString());

    const logTime = await getBlockTime(provider, singleLog.blockHash);
    console.log(logTime);
    console.log(ColonyRole);


    console.log(`User ${userAddress} claimed ${convertedAmount}${token} payout from pot ${humanReadableFundingPotId}.`)
  };

  return (
    <div className="App">
    <Provider store={store}>
        <Suspense fallback={<PageLoading />}>
        <Router>
          <Switch>
            <Route exact path="/" component={EventList} />
            <Route component={EventList} />
        </Switch>
        </Router>
        </Suspense>
      </Provider>
    </div>
  );
}

export default App;
