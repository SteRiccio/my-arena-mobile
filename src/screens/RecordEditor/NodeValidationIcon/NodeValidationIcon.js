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
  if (validation && !validation?.valid && NodeDefs.isSingle(nodeDef)) {
    const message = Validations.getJointErrorText({
      validation,
      t,
      customMessageLang: lang,
    });
    return (
      <Tooltip titleKey={message}>
        <WarningIconButton />
      </Tooltip>
    );
  }

  return null;
};
