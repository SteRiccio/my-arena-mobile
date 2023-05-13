import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { NodeDefs } from "@openforis/arena-core";

import { Button } from "components";
import { DataEntryActions, SurveySelectors } from "state";

export const NodePageNavigationButton = (props) => {
  const { entityDef, icon, style } = props;

  const dispatch = useDispatch();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const onPress = useCallback(
    () =>
      dispatch(
        DataEntryActions.selectCurrentPageEntity({
          entityDefUuid: entityDef.uuid,
        })
      ),
    [entityDef]
  );
  return (
    <Button
      icon={icon}
      style={[{ maxWidth: 200 }, style]}
      textKey={NodeDefs.getLabelOrName(entityDef, lang)}
      onPress={onPress}
    />
  );
};
