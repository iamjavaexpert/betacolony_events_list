/** Colony JS stuff here */
import { getColonyNetworkClient, Network, getLogs, ColonyRole, getBlockTime   } from '@colony/colony-js';
import { Wallet, utils  } from 'ethers';
import { InfuraProvider } from 'ethers/providers';

export async function getColonyClientInstance() {
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

    return colonyClient;
}

export async function getAllEventList(colonyClient) {
    const eventFilter = colonyClient.filters.PayoutClaimed();

    // Get the raw logs array
    const eventLogs = await getLogs(colonyClient, eventFilter);

    const parsedLogs = eventLogs.map(event => colonyClient.interface.parseLog(event));

    return parsedLogs;
}

export function getEventToken(singleLog) {
    const token = new utils.BigNumber(
        singleLog.values.token
      ).toString();

    return token;
}


export function getFoundingPotId(singleLog) {
    const humanReadableFundingPotId = new utils.BigNumber(
        singleLog.values.fundingPotId
      ).toString();

    return humanReadableFundingPotId;
}

export async function getUserAddress(colonyClient, singleLog) {
    const humanReadableFundingPotId = new utils.BigNumber(
        singleLog.values.fundingPotId
    ).toString();
    const {
    associatedTypeId,
    } = await colonyClient.getFundingPot(humanReadableFundingPotId);
    const { recipient: userAddress } = await colonyClient.getPayment(associatedTypeId);    
    
    return userAddress;
}

export function getAmount(singleLog) {
    const humanReadableAmount = new utils.BigNumber(singleLog.values.amount);
    const wei = new utils.BigNumber(10);

    // The converted amount is the human readable amount divided by the wei value raised to the power of 18
    const convertedAmount = humanReadableAmount.div(wei.pow(18));

    const amount = convertedAmount.toString();
    
    return amount;
}

export async function getDateTime(singleLog) {
    const provider = new InfuraProvider();

    const logTime = await getBlockTime(provider, singleLog.blockHash);
    return logTime;
}

export function getUserRole() {
    return ColonyRole;
}