import { ProgressBar } from "components";

export const ElapsedTimeProgressBar = (props) => {
  const { elapsedTime, elapsedTimeThreshold } = props;

  const progress = elapsedTime / elapsedTimeThreshold;

  return <ProgressBar progress={progress} style={{ height: 4, margin: 0 }} />;
};
