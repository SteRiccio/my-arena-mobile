import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { NodeDefs } from "@openforis/arena-core";

import { Button } from "../../../components";
import { DataEntryActions } from "../../../state/dataEntry/actions";
import { SurveySelectors } from "../../../state/survey/selectors";

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
      style={style}
      textKey={NodeDefs.getLabelOrName(entityDef, lang)}
      onPress={onPress}
    />
  );
};
