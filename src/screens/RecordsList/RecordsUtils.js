import { NodeDefs, NodeValueFormatter, Objects } from "@openforis/arena-core";
import { SurveyDefs } from "model";

const getValuesByKeyFormatted = ({ survey, lang, recordSummary, t }) => {
  const { cycle } = recordSummary;
  const rootDefKeys = SurveyDefs.getRootKeyDefs({ survey, cycle });
  return rootDefKeys.reduce((acc, keyDef) => {
    const recordKeyProp = Objects.camelize(NodeDefs.getName(keyDef));
    const value = recordSummary[recordKeyProp];
    let valueFormatted = NodeValueFormatter.format({
      survey,
      nodeDef: keyDef,
      value,
      showLabel: true,
      lang,
    });
    if (Objects.isEmpty(valueFormatted)) {
      valueFormatted = Objects.isEmpty(value)
        ? t("common:empty")
        : String(value);
    }
    acc[recordKeyProp] = valueFormatted;
    return acc;
  }, {});
};

export const RecordsUtils = {
  getValuesByKeyFormatted,
};