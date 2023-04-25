import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export const useNavigationFocus = ({ onFocus }) => {
  const navigation = useNavigation();

  useEffect(() => {
    const focusHandler = navigation.addListener("focus", onFocus);
    return focusHandler;
  }, [navigation]);
};
