import { useState } from "react";
import { TextInput as RNPTextInput } from "react-native-paper";

import { TextInput } from "./TextInput";

export const TextInputPassword = (props) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <TextInput
      secureTextEntry={secureTextEntry}
      right={
        <RNPTextInput.Icon
          icon="eye"
          onPress={() => {
            setSecureTextEntry(!secureTextEntry);
          }}
        />
      }
      {...props}
    />
  );
};
