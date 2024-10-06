import PropTypes from "prop-types";

import { NodeDefs } from "@openforis/arena-core";

import { Tooltip, WarningIconButton } from "components";
import { useTranslation } from "localization";
import { ValidationUtils } from "model/utils/ValidationUtils";
import { DataEntrySelectors, SurveySelectors } from "state";

const { getJointErrorText, getJointWarningText } = ValidationUtils;

export const NodeValidationIcon = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  const { t } = useTranslation();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const customMessageLang = lang;

  const nodeDefUuid = nodeDef.uuid;

  const validation = DataEntrySelectors.useRecordNodePointerValidation({
    parentNodeUuid,
    nodeDefUuid,
  });

  const validationChildrenCount =
    DataEntrySelectors.useRecordNodePointerValidationChildrenCount({
      parentNodeUuid,
      nodeDefUuid,
    });

  if (!validation && !validationChildrenCount) return null;

  if (validationChildrenCount && !validationChildrenCount.valid) {
    const message = "required field";
    return (
      <Tooltip titleKey={message}>
        <WarningIconButton avoidMultiplePress={false} />
      </Tooltip>
    );
  }
  if (validation && !validation.valid && NodeDefs.isSingle(nodeDef)) {
    const err = getJointErrorText({ validation, t, customMessageLang });
    const warn = getJointWarningText({ validation, t, customMessageLang });
    const backgroundColor = err ? "darkred" : "orange";
    const textColor = err ? "white" : "black";

    return (
      <Tooltip
        backgroundColor={backgroundColor}
        textColor={textColor}
        titleKey={err || warn}
      >
        <WarningIconButton
          avoidMultiplePress={false}
          iconColor={backgroundColor}
        />
      </Tooltip>
    );
  }

  return null;
};

NodeValidationIcon.propTypes = {
  nodeDef: PropTypes.object.isRequired,
  parentNodeUuid: PropTypes.string,
};
