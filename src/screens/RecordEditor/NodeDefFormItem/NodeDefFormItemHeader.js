import ViewMoreText from "react-native-view-more-text";
import PropTypes from "prop-types";

import { NodeDefs, Objects } from "@openforis/arena-core";

import { SurveySelectors } from "state/survey";

import { Text } from "components/Text";
import { View } from "components/View";

import { NodeValidationIcon } from "../NodeValidationIcon";
import styles from "./styles";

export const NodeDefFormItemHeader = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const labelOrName = NodeDefs.getLabelOrName(nodeDef, lang);
  const description = nodeDef.props?.descriptions?.[lang];

  return (
    <>
      <View style={styles.nodeDefLabelContainer}>
        <Text style={styles.nodeDefLabel} variant="titleLarge">
          {labelOrName}
        </Text>
        <NodeValidationIcon nodeDef={nodeDef} parentNodeUuid={parentNodeUuid} />
      </View>
      {!Objects.isEmpty(description) && (
        <ViewMoreText
          textStyle={styles.nodeDefDescriptionViewMoreText}
          numberOfLines={2}
        >
          <Text style={styles.nodeDefDescriptionText}>{description}</Text>
        </ViewMoreText>
      )}
    </>
  );
};

NodeDefFormItemHeader.propTypes = {
  nodeDef: PropTypes.object.isRequired,
  parentNodeUuid: PropTypes.string,
};
