import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { NodeDefs } from "@openforis/arena-core";

import { DataEntryActions } from "../../../state/dataEntry/actions";
import { Button } from "../../../components";

export const NodePageNavigationButton = (props) => {
  const { entityDef, icon, style } = props;

  const dispatch = useDispatch();

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
      textKey={NodeDefs.getName(entityDef)}
      onPress={onPress}
    />
  );
};
