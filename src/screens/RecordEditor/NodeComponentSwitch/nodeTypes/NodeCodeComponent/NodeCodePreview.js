import PropTypes from "prop-types";

import { NodeDefs } from "@openforis/arena-core";

import { Button } from "components/Button";
import { HView } from "components/HView";

import styles from "./styles";

const OpenDropdownButton = (props) => {
  const { onPress, textKey, textParams } = props;

  return (
    <Button
      contentStyle={{ flexDirection: "row-reverse" }}
      icon="chevron-down"
      mode="contained-tonal"
      textKey={textKey}
      textParams={textParams}
      onPress={onPress}
      style={styles.openDropdownButton}
    />
  );
};

OpenDropdownButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  textKey: PropTypes.string,
  textParams: PropTypes.object,
};

OpenDropdownButton.defaultProps = {
  textKey: "dataEntry:code.selectItem",
};

export const NodeCodePreview = (props) => {
  const { itemLabelFunction, nodeDef, openEditDialog, selectedItems } = props;

  const multiple = NodeDefs.isMultiple(nodeDef);

  return (
    <HView style={{ flexWrap: "wrap" }}>
      {multiple ? (
        <>
          {selectedItems.map((item) => (
            <Button
              key={item.uuid}
              mode="outlined"
              onPress={openEditDialog}
              style={styles.previewItem}
            >
              {itemLabelFunction(item)}
            </Button>
          ))}
          <OpenDropdownButton
            onPress={openEditDialog}
            textParams={{ count: multiple ? 2 : 1 }}
          />
        </>
      ) : (
        <OpenDropdownButton
          onPress={openEditDialog}
          textKey={
            selectedItems.length === 1
              ? itemLabelFunction(selectedItems[0])
              : "dataEntry:code.selectItem"
          }
        />
      )}
    </HView>
  );
};

NodeCodePreview.propTypes = {
  itemLabelFunction: PropTypes.func.isRequired,
  nodeDef: PropTypes.object.isRequired,
  openEditDialog: PropTypes.func.isRequired,
  selectedItems: PropTypes.array,
};

NodeCodePreview.defaultProps = {
  selectedItems: [],
};
