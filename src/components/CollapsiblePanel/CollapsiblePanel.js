import { useCallback, useState } from "react";
import Collapsible from "react-native-collapsible";
import PropTypes from "prop-types";

import { Button } from "../Button";
import { VView } from "../VView";

import { useStyles } from "./styles";
import { HView } from "..";
import { TouchableOpacity } from "react-native";

export const CollapsiblePanel = (props) => {
  const { children, containerStyle, headerContent, headerKey, headerParams } =
    props;

  const styles = useStyles();

  const [collapsed, setCollapsed] = useState(true);

  const onHeaderPress = useCallback(
    () => setCollapsed(!collapsed),
    [collapsed]
  );

  return (
    <VView style={[styles.container, containerStyle]}>
      {headerContent ? (
        <TouchableOpacity onPress={onHeaderPress}>
          {headerContent}
        </TouchableOpacity>
      ) : (
        <Button
          icon={collapsed ? "chevron-down" : "chevron-up"}
          contentStyle={styles.headerButtonContent}
          labelStyle={styles.headerButtonLabel}
          mode="text"
          onPress={onHeaderPress}
          style={styles.headerButton}
          textKey={headerKey}
          textParams={headerParams}
        />
      )}
      <Collapsible collapsed={collapsed} style={styles.collapsibleContainer}>
        {children}
      </Collapsible>
    </VView>
  );
};

CollapsiblePanel.propTypes = {
  children: PropTypes.node,
  containerStyle: PropTypes.object,
  headerContent: PropTypes.node,
  headerKey: PropTypes.string.isRequired,
  headerParams: PropTypes.object,
};
