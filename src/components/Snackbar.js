import { Snackbar as RNPSnackbar } from "react-native-paper";

export const Snackbar = (props) => {
  const { visible } = props;
  return (
    <RNPSnackbar visible={visible} onDismiss={onDismiss} action={action}>
      {content}
    </RNPSnackbar>
  );
};
