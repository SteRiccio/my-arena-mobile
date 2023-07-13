import { useCallback, useState } from "react";
import Collapsible from "react-native-collapsible";

import { Button } from "../Button";
import { VView } from "../VView";

import styles from "./styles";

export const CollapsiblePanel = (props) => {
  const { children, headerKey } = props;

  const [collapsed, setCollapsed] = useState(true);

  const onHeaderPress = useCallback(
    () => setCollapsed(!collapsed),
    [collapsed]
  );

  return (
    <VView style={styles.container}>
      <Button
        icon={collapsed ? "chevron-down" : "chevron-up"}
        contentStyle={styles.headerButtonContent}
        labelStyle={styles.headerButtonLabel}
        mode="text"
        onPress={onHeaderPress}
        style={styles.headerButton}
        textKey={headerKey}
      />
      <Collapsible collapsed={collapsed} style={styles.collapsibleContainer}>
        {children}
      </Collapsible>
    </VView>
  );
};
