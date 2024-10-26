import PropTypes from "prop-types";

import { Surveys } from "@openforis/arena-core";

import {
  Button,
  CollapsiblePanel,
  FlexWrapView,
  FormItem,
  HView,
  Switch,
  Text,
} from "components";
import { SurveyCycleSelector } from "./SurveyCycleSelector";
import { SurveyLanguageSelector } from "./SurveyLanguageSelector";

import { useIsNetworkConnected } from "hooks";
import { Cycles } from "model";
import { SurveySelectors } from "state";
import styles from "./styles";

export const RecordsListOptionsPanel = (props) => {
  const {
    onImportRecordsFromFilePress,
    onlyLocal,
    onOnlyLocalChange,
    onRemoteSyncPress,
    syncStatusLoading,
  } = props;

  const networkAvailable = useIsNetworkConnected();
  const survey = SurveySelectors.useCurrentSurvey();

  const defaultCycleKey = Surveys.getDefaultCycleKey(survey);
  const defaultCycleText = Cycles.labelFunction(defaultCycleKey);
  const cycles = Surveys.getCycleKeys(survey);

  return (
    <CollapsiblePanel headerKey="dataEntry:options">
      <SurveyLanguageSelector />
      {cycles.length > 1 && (
        <HView style={styles.formItem}>
          <Text
            style={styles.formItemLabel}
            textKey="dataEntry:cycleForNewRecords"
          />
          <Text textKey={defaultCycleText} />
        </HView>
      )}
      <FlexWrapView>
        {cycles.length > 1 && (
          <SurveyCycleSelector style={styles.cyclesSelector} />
        )}
        <FormItem
          labelKey="dataEntry:showOnlyLocalRecords"
          style={styles.formItem}
        >
          <Switch value={onlyLocal} onChange={onOnlyLocalChange} />
        </FormItem>
        <Button
          disabled={!networkAvailable}
          icon="cloud-refresh"
          loading={syncStatusLoading}
          mode="outlined"
          onPress={onRemoteSyncPress}
          textKey="dataEntry:checkSyncStatus"
        />
        <Button
          icon="file-import-outline"
          mode="text"
          onPress={onImportRecordsFromFilePress}
          textKey="dataEntry:records.importRecordsFromFile.title"
        />
      </FlexWrapView>
    </CollapsiblePanel>
  );
};

RecordsListOptionsPanel.propTypes = {
  onImportRecordsFromFilePress: PropTypes.func.isRequired,
  onlyLocal: PropTypes.bool.isRequired,
  onOnlyLocalChange: PropTypes.func.isRequired,
  onRemoteSyncPress: PropTypes.func.isRequired,
  syncStatusLoading: PropTypes.bool.isRequired,
};
