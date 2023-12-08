import { useCallback, useState } from "react";
import Collapsible from "react-native-collapsible";
import PropTypes from "prop-types";

import { Button } from "../Button";
import { VView } from "../VView";

import { useStyles } from "./styles";

export const CollapsiblePanel = (props) => {
  const { children, containerStyle, headerKey, headerParams } = props;

  const styles = useStyles();

  const [collapsed, setCollapsed] = useState(true);

  const onHeaderPress = useCallback(
    () => setCollapsed(!collapsed),
    [collapsed]
  );

  return (
    <VView style={[styles.container, containerStyle]}>
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
      <Collapsible collapsed={collapsed} style={styles.collapsibleContainer}>
        {children}
      </Collapsible>
    </VView>
  );
};

CollapsiblePanel.propTypes = {
  children: PropTypes.node,
  containerStyle: PropTypes.object,
  headerKey: PropTypes.string.isRequired,
  headerParams: PropTypes.object,
};
