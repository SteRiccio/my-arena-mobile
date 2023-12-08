import { Banner } from "react-native-paper";
import PropTypes from "prop-types";

import { useTranslation } from "localization";

export const ItemSelectedBanner = (props) => {
  const { onDeleteSelected, selectedItemIds } = props;

  const { t } = useTranslation();

  return (
    <Banner
      actions={[
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
  onDeleteSelected: PropTypes.func.isRequired,
  selectedItemIds: PropTypes.array.isRequired,
};
