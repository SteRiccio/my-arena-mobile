import { Banner } from "react-native-paper";
import PropTypes from "prop-types";

import { useTranslation } from "localization";

export const ItemSelectedBanner = (props) => {
  const { onDeleteSelected, selectedItemIds, customActions } = props;

  const { t } = useTranslation();

  return (
    <Banner
      actions={[
        ...customActions,
        {
          label: t("common:deleteSelectedTitle"),
          onPress: onDeleteSelected,
        },
      ]}
      visible={selectedItemIds.length > 0}
    />
  );
};

ItemSelectedBanner.propTypes = {
  customActions: PropTypes.array,
  onDeleteSelected: PropTypes.func.isRequired,
  selectedItemIds: PropTypes.array.isRequired,
};

ItemSelectedBanner.defaultProps = {
  customActions: [],
};
