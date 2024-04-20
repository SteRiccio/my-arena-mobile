import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

import { Surveys } from "@openforis/arena-core";

import { Cycles } from "model";
import { Dropdown, HView, Text } from "components";
import { SurveyActions, SurveySelectors } from "state";

import styles from "./styles";

export const SurveyCycleSelector = () => {
  const dispatch = useDispatch();
  const survey = SurveySelectors.useCurrentSurvey();
  const cycle = SurveySelectors.useCurrentSurveyCycle();
  const defaultCycleKey = Surveys.getDefaultCycleKey(survey);
  const cycles = survey?.props?.cycles || {};
  const singleCycle = Object.entries(cycles).length === 1;

  const cycleLabelFn = (cycleKey) => String(Number(cycleKey) + 1);

  const items = Object.entries(cycles).map(([cycleKey, cycle]) => ({
    value: cycleKey,
    label: Cycles.labelFunction(cycleKey),
  }));

  const selectedValue = singleCycle ? defaultCycleKey : cycle;

  const onChange = useCallback((selectedCycleKey) => {
    dispatch(
      SurveyActions.setCurrentSurveyCycle({ cycleKey: selectedCycleKey })
    );
  }, []);

  return (
    <HView style={styles.formItem}>
      <Text style={styles.formItemLabel} textKey="dataEntry:cycle" />
      {singleCycle ? (
        <Text textKey={cycleLabelFn(selectedValue)} />
      ) : (
        <Dropdown
          disabled={singleCycle}
          items={items}
          onChange={onChange}
          showLabel={false}
          value={selectedValue}
        />
      )}
    </HView>
  );
};
