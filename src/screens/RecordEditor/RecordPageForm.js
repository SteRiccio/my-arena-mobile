import { Surveys } from "@openforis/arena-core";

import { SurveySelectors } from "../../state/survey/selectors";
import { DataEntrySelectors } from "../../state/dataEntry/selectors";
import { NodeEntityFormComponent } from "./NodeComponentSwitch/nodeTypes/NodeEntityFormComponent";
import { ScrollView } from "react-native";

export const RecordPageForm = () => {
  if (__DEV__) {
    console.log("rendering RecordPageForm");
  }

  const survey = SurveySelectors.useCurrentSurvey();
  const nodeDef = Surveys.getNodeDefRoot({ survey });
  const nodeUuid = DataEntrySelectors.useRecordRootNodeUuid();

  return (
    <ScrollView>
      <NodeEntityFormComponent nodeDef={nodeDef} nodeUuid={nodeUuid} />
    </ScrollView>
  );
};
