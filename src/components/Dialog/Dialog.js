import { Dialog as RNPDialog, Portal } from "react-native-paper";
import PropTypes from "prop-types";

import { useTranslation } from "localization";
import { Button } from "../Button";

export const Dialog = (props) => {
  const { children, closeButtonTextKey, onClose, style, title } = props;

  const { t } = useTranslation();
  return (
    <Portal>
      <RNPDialog onDismiss={onClose} style={style} visible>
        <RNPDialog.Title>{t(title)}</RNPDialog.Title>
        <RNPDialog.Content>{children}</RNPDialog.Content>
        <RNPDialog.Actions>
          <Button onPress={onClose} textKey={closeButtonTextKey} />
        </RNPDialog.Actions>
      </RNPDialog>
    </Portal>
  );
};

Dialog.propTypes = {
  children: PropTypes.node,
  closeButtonTextKey: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  style: PropTypes.object,
  title: PropTypes.string.isRequired,
};

Dialog.defaultProps = {
  closeButtonTextKey: "common:close",
};
