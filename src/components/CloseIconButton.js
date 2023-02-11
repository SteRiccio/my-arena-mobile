import { Button } from "./Button";

export const CloseIconButton = (props) => {
  const { children, ...otherProps } = props;

  return (
    <Button icon="close" {...otherProps}>
      {children}
    </Button>
  );
};
