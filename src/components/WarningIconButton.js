import { Button } from "./Button";

export const WarningIconButton = (props) => {
  const { children, ...otherProps } = props;

  return (
    <Button icon="alert" {...otherProps}>
      {children}
    </Button>
  );
};
