import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import MenuDrawer from "react-native-side-drawer";

import { CloseIconButton } from "../../components";
import { PagesTree } from "./PagesTree";
import { RecordPageForm } from "./RecordPageForm";

const styles = StyleSheet.create({
  animatedBox: {
    flex: 1,
    backgroundColor: "#38C8EC",
    padding: 10,
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F04812",
  },
});

export const RecordEditor = (props) => {
  const [state, setState] = useState({ open: false });

  const { open } = state;

  const toggleOpen = () => {
    setState({ open: !open });
  };

  const drawerContent = useCallback(() => {
    if (!open) return null;
    return (
      <View style={styles.animatedBox}>
        <CloseIconButton onPress={toggleOpen} />
        <PagesTree />
      </View>
    );
  }, [open]);

  return (
    <>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={toggleOpen} />
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="<Entity>" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>

      <MenuDrawer
        open={open}
        position="left"
        drawerContent={drawerContent()}
        drawerPercentage={45}
        animationTime={250}
        overlay={true}
        opacity={0.4}
      >
        <RecordPageForm />
      </MenuDrawer>
    </>
  );
};
