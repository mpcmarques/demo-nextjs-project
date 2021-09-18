import { createStore } from "redux";
import { createWrapper } from "next-redux-wrapper";
import reducers from "./reducers";

const makeStore = () => {
  // Create store
  const store = createStore(reducers);

  // Return store
  return store;
};

// export an assembled wrapper
export const storeWrapper = createWrapper(makeStore, { debug: false });
