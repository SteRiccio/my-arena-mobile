import { useCallback } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { NodeDefs } from "@openforis/arena-core";

import { Button } from "components";
import { DataEntryActions, DataEntrySelectors, SurveySelectors } from "state";

export const SingleNodeNavigationButton = (props) => {
  const { childDefIndex, icon, style } = props;

  const dispatch = useDispatch();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const childDefs = DataEntrySelectors.useCurrentPageEntityRelevantChildDefs();
  const childDef = childDefs[childDefIndex];

  const onPress = useCallback(
    () =>
      dispatch(
        DataEntryActions.selectCurrentPageEntityActiveChildIndex(childDefIndex)
      ),
    [childDefIndex, dispatch]
  );

  return (
    <Button
      icon={icon}
      style={[{ maxWidth: 200 }, style]}
      textKey={NodeDefs.getLabelOrName(childDef, lang)}
      onPress={onPress}
    />
  );
};

SingleNodeNavigationButton.propTypes = {
  childDefIndex: PropTypes.number,
  icon: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
