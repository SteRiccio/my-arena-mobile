import { useState } from "react";

import { DataTable } from "../DataTable";
import { DataList } from "../DataList";
import { Switch } from "../Switch";
import { VView } from "../VView";
import { SegmentedButtons } from "../SegmentedButtons";

const modes = {
  dataTable: "dataTable",
  dataList: "dataList",
};

export const DataVisualizer = (props) => {
  const [mode, setMode] = useState(modes.dataTable);

  return (
    <VView style={{ flex: 1 }}>
      <SegmentedButtons
        buttons={Object.values(modes).map((m) => ({ label: m, value: m }))}
        onChange={setMode}
      />
      {mode === modes.dataTable ? (
        <DataTable {...props} />
      ) : (
        <DataList {...props} />
      )}
    </VView>
  );
};
