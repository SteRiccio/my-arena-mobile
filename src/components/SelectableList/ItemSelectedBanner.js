import { useMemo } from "react";
import { Banner } from "react-native-paper";
import PropTypes from "prop-types";

import { useTranslation } from "localization";

const customActionToAction = ({ t, customAction }) => {
  const {
    labelKey,
    labelParams,
    mode = "outlined",
    onPress,
    ...otherProps
  } = customAction;
  return { label: t(labelKey, labelParams), mode, onPress, ...otherProps };
};

export const ItemSelectedBanner = (props) => {
  const { onDeleteSelected, selectedItemIds, customActions = [] } = props;

  const { t } = useTranslation();

  const actions = useMemo(
    () =>
      [
        ...customActions,
        {
          icon: "trash-can-outline",
          labelKey: "common:delete",
          onPress: onDeleteSelected,
        },
      ].map((customAction) => customActionToAction({ t, customAction })),
    [customActions]
  );

  return <Banner actions={actions} visible={selectedItemIds.length > 0} />;
};

ItemSelectedBanner.propTypes = {
  customActions: PropTypes.array,
  onDeleteSelected: PropTypes.func.isRequired,
  selectedItemIds: PropTypes.array.isRequired,
};
