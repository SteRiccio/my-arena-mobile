import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

import { Surveys } from "@openforis/arena-core";

import { Cycles } from "model";
import { Dropdown, HView, SegmentedButtons, Text } from "components";
import { SurveyActions, SurveySelectors } from "state";

import styles from "./styles";

export const SurveyCycleSelector = (props) => {
  const { style } = props;
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
    <HView style={[styles.formItem, style]}>
      <Text textKey="dataEntry:cycle" />
      {singleCycle ? (
        <Text textKey={cycleLabelFn(selectedValue)} />
      ) : items.length <= 3 ? (
        <SegmentedButtons
          buttons={items}
          onChange={onChange}
          style={{ width: items.length * 30 }}
          value={selectedValue}
        />
      ) : (
        <Dropdown items={items} onChange={onChange} value={selectedValue} />
      )}
    </HView>
  );
};
