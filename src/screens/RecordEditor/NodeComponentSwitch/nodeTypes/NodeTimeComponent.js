import { DateFormats } from "@openforis/arena-core";

import { NodeDateTimeComponent } from "./NodeDateTimeComponent";

export const NodeTimeComponent = (props) => (
  <NodeDateTimeComponent
    formatDisplay={DateFormats.timeStorage}
    formatStorage={DateFormats.timeStorage}
    mode="time"
    {...props}
  />
);

NodeTimeComponent.propTypes = NodeDateTimeComponent.propTypes;
