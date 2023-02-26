import { useCallback } from "react";

import { Button, Text, TextInput, VView } from "../../components";
import { AuthService } from "../../service/authService";

export const CredentialPreference = (props) => {
  const { settings, updateSettings } = props;
  const { email, password } = settings;

  const onEmailChange = useCallback(
    async (text) =>
      updateSettings((settings) => ({ ...settings, email: text })),
    [updateSettings]
  );

  const onPasswordChange = useCallback(
    async (text) =>
      updateSettings((settings) => ({ ...settings, password: text })),
    [updateSettings]
  );

  const onLogin = useCallback(async () => {
    if (__DEV__) {
      console.log(await AuthService.login(email, password));
    }
  }, [email, password]);

  return (
    <VView>
      <Text textKey="Credentials" />
      <TextInput label="Email" onChange={onEmailChange} value={email} />
      <TextInput
        label="Password"
        onChange={onPasswordChange}
        value={password}
        secureTextEntry
      />
      <Button onPress={onLogin}>Login</Button>
    </VView>
  );
};
