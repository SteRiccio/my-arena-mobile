import { useEffect } from "react";
import { BackHandler } from "react-native";

export const useBackHandler = (onBack) => {
  useEffect(() => {
    console.log("===registering onback");
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBack
    );
    return () => backHandler.remove();
  }, [onBack]);
};
