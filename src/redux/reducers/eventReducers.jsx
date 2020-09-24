import {
  GET_EVENT_LIST
} from "../types";

const initialState = {
  loading: false,
  eventList: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_EVENT_LIST:
      return {
        loading: false,
        eventList: action.payload,
      };
    default:
      return state;
  }
}
