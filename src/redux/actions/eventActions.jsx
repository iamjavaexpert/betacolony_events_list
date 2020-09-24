import {
  GET_EVENT_LIST,
} from "../types";

import { 
  getAllEventList,
  getColonyClientInstance,
  getUserAddress,
  getEventToken,
  getFoundingPotId,
  getAmount,
  getDateTime
 } from './../../utils/eventFunctions';

 import { ColonyRole   } from '@colony/colony-js';

/**
 * Get Event list data from server
 */
export const getEventList = () => async (
  dispatch
) => { 
  const colonyClient = await getColonyClientInstance();
  console.log(colonyClient);
  const eventList = await getAllEventList(colonyClient);
  console.log(eventList);

  let eventListData = [];

  eventList.map(async (item, index) => {
    const userAddress = await getUserAddress(colonyClient, item);
    const token =  getEventToken(item);
    const foundingPotId =  getFoundingPotId(item);
    const amount =  getAmount(item);
    const dateTime = await getDateTime(item);

    const date = new Date(dateTime);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });    
    eventListData.push(
      {
        name: item.name,
        type: item.name,
        userAddress,
        token,
        foundingPotId,
        amount,
        date: dateTime,
        dateTime: `${day} ${month}`,
        color: getRandomColor(),
        bgColor: getRandomColor(),
        spotColor: getRandomColor()
      }
    )  
    if (index === (eventList.length - 1)) {
      dispatch({ type: GET_EVENT_LIST, payload: eventListData });
    }  
  });
};

export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

