import { combineReducers } from "redux";

import eventReducer from "./eventReducers";

const appReducer = combineReducers({
  event: eventReducer,
});

export default appReducer;
