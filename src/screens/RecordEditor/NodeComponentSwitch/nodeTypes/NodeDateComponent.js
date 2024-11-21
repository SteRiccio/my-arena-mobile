import { DateFormats } from "@openforis/arena-core";

import { NodeDateTimeComponent } from "./NodeDateTimeComponent";

export const NodeDateComponent = (props) => (
  <NodeDateTimeComponent
    formatDisplay={DateFormats.dateDisplay}
    formatStorage={DateFormats.dateStorage}
    mode="date"
    {...props}
  />
);

NodeDateComponent.propTypes = NodeDateTimeComponent.propTypes;
