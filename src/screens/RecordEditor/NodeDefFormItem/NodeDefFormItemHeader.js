import PropTypes from "prop-types";

import { NodeDefs, Objects } from "@openforis/arena-core";

import { SurveySelectors } from "state/survey";

import { HViewTextDirectionAware } from "components/HViewTextDirectionAware";
import { Text } from "components/Text";
import { ViewMoreText } from "components/ViewMoreText";

import { NodeValidationIcon } from "../NodeValidationIcon";
import { useStyles } from "./styles";

export const NodeDefFormItemHeader = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  const styles = useStyles();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const labelOrName = NodeDefs.getLabelOrName(nodeDef, lang);
  const description = NodeDefs.getDescription(nodeDef, lang);

  return (
    <>
      <HViewTextDirectionAware style={styles.nodeDefLabelContainer}>
        <Text style={styles.nodeDefLabel} variant="titleLarge">
          {labelOrName}
        </Text>
        <NodeValidationIcon nodeDef={nodeDef} parentNodeUuid={parentNodeUuid} />
      </HViewTextDirectionAware>
      {!Objects.isEmpty(description) && (
        <ViewMoreText textStyle={styles.nodeDefDescriptionViewMoreText}>
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
