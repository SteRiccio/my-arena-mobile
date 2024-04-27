import { Text } from "components";

export const CoordinateValuePreview = (props) => {
  const { value } = props;

  return <Text>{JSON.stringify(value)}</Text>;
};
