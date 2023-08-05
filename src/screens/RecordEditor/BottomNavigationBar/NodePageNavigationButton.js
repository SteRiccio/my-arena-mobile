import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { NodeDefs, Objects } from "@openforis/arena-core";

import { Button } from "components";
import { DataEntryActions, SurveySelectors } from "state";

export const NodePageNavigationButton = (props) => {
  const { entityPointer, icon, mode, style } = props;

  const { parentEntityUuid, entityDef, entityUuid, index } = entityPointer;

  const dispatch = useDispatch();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const onPress = useCallback(
    () =>
      dispatch(
        DataEntryActions.selectCurrentPageEntity({
          parentEntityUuid,
          entityDefUuid: entityDef.uuid,
          entityUuid,
        })
      ),
    [entityDef, entityUuid, parentEntityUuid]
  );
  return (
    <Button
      icon={icon}
      mode={mode}
      style={[{ maxWidth: 200 }, style]}
      textKey={
        NodeDefs.getLabelOrName(entityDef, lang) +
        (Objects.isEmpty(index) ? "" : `[${index + 1}]`)
      }
      onPress={onPress}
    />
  );
};
