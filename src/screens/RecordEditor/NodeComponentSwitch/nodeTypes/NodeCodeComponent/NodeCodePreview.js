import PropTypes from "prop-types";
import { Chip } from "react-native-paper";

import { NodeDefs } from "@openforis/arena-core";

import { Button } from "components/Button";
import { HView } from "components/HView";

export const NodeCodePreview = (props) => {
  const { itemLabelFunction, nodeDef, openEditDialog, selectedItems } = props;

  return (
    <HView style={{ flexWrap: "wrap" }}>
      {selectedItems.map((item) => (
        <Chip
          key={item.uuid}
          onPress={openEditDialog}
          style={{ margin: 2, padding: 4 }}
        >
          {itemLabelFunction(item)}
        </Chip>
      ))}
      {(selectedItems.length === 0 || NodeDefs.isMultiple(nodeDef)) && (
        <Button
          textKey="dataEntry:code.selectItem"
          textParams={{ count: NodeDefs.isMultiple(nodeDef) ? 2 : 1 }}
          onPress={openEditDialog}
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
