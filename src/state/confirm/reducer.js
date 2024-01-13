import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  titleKey: "common:confirm",
  cancelButtonTextKey: "common:cancel",
  confirmButtonTextKey: "common:confirm",
  onConfirm: null,
  onCancel: null,
  singleChoiceOptions: [],
  defaultSingleChoiceValue: null,
  swipeToConfirm: false,
  swipeToConfirmTitleKey: "common:swipeToConfirm",
};

const confirm = createAsyncThunk(
  "confirm/show",
  async (params, { getState }) => {
    const { selectedSingleChoiceValue } = params;
    const state = getState();
    const { onConfirm } = state.confirm;
    await onConfirm?.({ selectedSingleChoiceValue });
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
    onConfirm,
    onCancel = undefined,
    singleChoiceOptions = [],
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
      onConfirm,
      onCancel,
      singleChoiceOptions,
      defaultSingleChoiceValue,
      swipeToConfirm,
      swipeToConfirmTitleKey,
    }),
  confirm: ({ selectedSingleChoiceValue }) =>
    confirm({ selectedSingleChoiceValue }),
  cancel,
};
export { ConfirmReducer };
