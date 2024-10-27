import { IconButton } from "./IconButton";

export const DeleteIconButton = (props) => (
  <IconButton icon="trash-can-outline" {...props} />
);

DeleteIconButton.propTypes = IconButton.propTypes;
