import { useMemo } from "react";

import { NodeDefs } from "@openforis/arena-core";

import { FormItem, Text, VView } from "components";
import { NodeValuePreviewPropTypes } from "./NodeValuePreviewPropTypes";

export const CoordinateValuePreview = (props) => {
  const { nodeDef, value } = props;

  const fields = useMemo(() => {
    const includedExtraFields = NodeDefs.getCoordinateAdditionalFields(nodeDef);
    return ["x", "y", "srs", ...includedExtraFields];
  }, [nodeDef]);

  return (
    <VView>
      {fields.map((fieldKey) => (
        <FormItem labelKey={`dataEntry:coordinate.${fieldKey}`}>
          <Text>{value[fieldKey]}</Text>
        </FormItem>
      ))}
    </VView>
  );

  return <Text>{JSON.stringify(value)}</Text>;
};

CoordinateValuePreview.propTypes = NodeValuePreviewPropTypes;
