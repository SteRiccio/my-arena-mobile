const applyReducerFunction = ({ actionHandlers, action, state = {} }) => {
  const actionHandler = actionHandlers[action.type];
  return actionHandler ? actionHandler({ state, action }) : state;
};

const exportReducer =
  ({ actionHandlers, intialState }) =>
  (state = intialState, action) =>
    applyReducerFunction({ actionHandlers, action, state });

export const StoreUtils = {
  exportReducer,
};
