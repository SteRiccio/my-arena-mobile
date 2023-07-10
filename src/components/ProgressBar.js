import * as React from "react";
import { ProgressBar as RNPProgressBar } from "react-native-paper";

export const ProgressBar = (props) => {
  const { color, indeterminate, progress } = props;

  return (
    <RNPProgressBar
      color={color}
      indeterminate={indeterminate}
      progress={progress}
      style={{
        alignSelf: "stretch",
        height: 20,
        margin: 10,
      }}
    />
  );
};

ProgressBar.defaultProps = {
  indeterminate: false,
  progress: 100,
}
