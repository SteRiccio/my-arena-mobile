import { ProgressBar } from "components";

const calculateProgress = ({ accuracy, accuracyThreshold }) => {
  if (!accuracy) return { progress: 0.25, color: "red" };

  if (accuracy <= accuracyThreshold) return { progress: 1, color: "green" };

  if (accuracy < 10) return { progress: 0.75, color: "orange" };

  return { progress: 0.5, color: "red" };
};

export const AccuracyProgressBar = (props) => {
  const { accuracy, accuracyThreshold } = props;

  const { progress, color } = calculateProgress({
    accuracy,
    accuracyThreshold,
  });

  return (
    <ProgressBar progress={progress} color={color} style={{ margin: 0 }} />
  );
};
