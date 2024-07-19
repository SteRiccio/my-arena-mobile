import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

// confirm and cancel as async thunk to allow calling "dispatch" inside onConfirm and onCancel
const confirm = createAsyncThunk(
  "confirm/show",
  async (params, { getState }) => {
    const { selectedMultipleChoiceValues, selectedSingleChoiceValue } = params;
    const state = getState();
    const { onConfirm } = state.confirm;
    await onConfirm?.({
      selectedMultipleChoiceValues,
      selectedSingleChoiceValue,
    });
  }
);

const cancel = createAsyncThunk(
  "confirm/cancel",
  async (_params, { getState }) => {
    const state = getState();
    const { onCancel } = state.confirm;
    await onCancel?.();
  }
);

const confirmSlice = createSlice({
  name: "confirm",
  initialState,
  reducers: {
    show: (_state, action) => ({
      ...action.payload,
      isOpen: true,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(confirm.fulfilled, () => initialState)
      .addCase(cancel.fulfilled, () => initialState);
  },
});

const { actions, reducer: ConfirmReducer } = confirmSlice;
const { show } = actions;

export const ConfirmActions = {
  show: ({
    titleKey = "common:confirm",
    cancelButtonTextKey = "common:cancel",
    confirmButtonTextKey = "common:confirm",
    messageKey,
    messageParams = {},
    multipleChoiceOptions = [],
    onConfirm,
    onCancel = undefined,
    singleChoiceOptions = [],
    defaultMultipleChoiceValues = [],
    defaultSingleChoiceValue = null,
    swipeToConfirm = false,
    swipeToConfirmTitleKey = "common:swipeToConfirm",
  }) =>
    show({
      titleKey,
      cancelButtonTextKey,
      confirmButtonTextKey,
      messageKey,
      messageParams,
      multipleChoiceOptions,
      onConfirm,
      onCancel,
      singleChoiceOptions,
      defaultMultipleChoiceValues,
      defaultSingleChoiceValue,
      swipeToConfirm,
      swipeToConfirmTitleKey,
    }),
  confirm: ({ selectedMultipleChoiceValues, selectedSingleChoiceValue }) =>
    confirm({ selectedMultipleChoiceValues, selectedSingleChoiceValue }),
  cancel,
};
export { ConfirmReducer };
