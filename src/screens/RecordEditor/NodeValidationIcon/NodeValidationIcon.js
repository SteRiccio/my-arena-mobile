import PropTypes from "prop-types";

import { NodeDefs } from "@openforis/arena-core";

import { Tooltip, WarningIconButton } from "components";
import { useTranslation } from "localization";
import { Validations } from "model/utils/Validations";
import { DataEntrySelectors, SurveySelectors } from "state";

export const NodeValidationIcon = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  const { t } = useTranslation();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

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
        <WarningIconButton />
      </Tooltip>
    );
  }
  if (validation && !validation.valid && NodeDefs.isSingle(nodeDef)) {
    const errorMessage = Validations.getJointErrorText({
      validation,
      t,
      customMessageLang: lang,
    });
    const warningMessage = Validations.getJointWarningText({
      validation,
      t,
      customMessageLang: lang,
    });
    const backgroundColor = errorMessage ? "darkred" : "orange";
    const textColor = errorMessage ? "white" : "black";

    return (
      <Tooltip
        backgroundColor={backgroundColor}
        textColor={textColor}
        titleKey={errorMessage || warningMessage}
      >
        <WarningIconButton iconColor={backgroundColor} />
      </Tooltip>
    );
  }

  return null;
};

NodeValidationIcon.propTypes = {
  nodeDef: PropTypes.object.isRequired,
  parentNodeUuid: PropTypes.string,
};
