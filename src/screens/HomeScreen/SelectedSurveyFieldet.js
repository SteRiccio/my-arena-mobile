import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";

import { Dates, Surveys } from "@openforis/arena-core";

import { Button, FieldSet, HView, IconButton, Text, VView } from "components";
import { SurveyActions, SurveySelectors } from "state/survey";
import { SurveyService } from "service/surveyService";
import { useIsNetworkConnected } from "hooks/useIsNetworkConnected";

import { screenKeys } from "../screenKeys";

import styles from "./selectedSurveyFieldsetStyles";
import { useToast } from "hooks/useToast";
import { useDispatch } from "react-redux";

const updateStatusKeys = {
  error: "error",
  loading: "loading",
  networkNotAvailable: "networkNotAvailable",
  notUpToDate: "notUpToDate",
  upToDate: "upToDate",
};

const iconByUpdateStatus = {
  [updateStatusKeys.loading]: "loading",
  [updateStatusKeys.upToDate]: "check",
  [updateStatusKeys.networkNotAvailable]: "alert",
  [updateStatusKeys.notUpToDate]: "alert",
  [updateStatusKeys.error]: "alert-circle",
};

const UpdateStatusIcon = ({ updateStatus }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toaster = useToast();
  const survey = SurveySelectors.useCurrentSurvey();
  const [loading, setLoading] = useState(false);

  const icon = loading ? "loading" : iconByUpdateStatus[updateStatus];

  const onPress = () => {
    switch (updateStatus) {
      case updateStatusKeys.error:
        toaster.show("surveys:updateStatus.error");
        break;
      case updateStatusKeys.networkNotAvailable:
        toaster.show("surveys:updateStatus.networkNotAvailable");
        break;
      case updateStatusKeys.upToDate:
        toaster.show("surveys:updateStatus.upToDate");
        break;
      case updateStatusKeys.notUpToDate:
        dispatch(
          SurveyActions.updateSurveyRemote({
            surveyId: survey.id,
            surveyName: Surveys.getName(survey),
            surveyRemoteId: survey.remoteId,
            navigation,
            onConfirm: () => setLoading(true),
            onComplete: () => setLoading(false),
          })
        );
        break;
    }
  };
  return (
    <IconButton
      disabled={loading}
      icon={icon}
      style={styles.updateStatusIconButton}
      onPress={onPress}
    />
  );
};

UpdateStatusIcon.propTypes = {
  updateStatus: PropTypes.string.isRequired,
};

export const SelectedSurveyFieldset = () => {
  const navigation = useNavigation();
  const networkAvailable = useIsNetworkConnected();

  const survey = SurveySelectors.useCurrentSurvey();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const surveyName = Surveys.getName(survey);
  const surveyLabelInDefaultLanguage = Surveys.getLabel(lang)(survey);
  const surveyTitle = `${surveyLabelInDefaultLanguage} [${surveyName}]`;

  const [updateStatus, setUpdateStatus] = useState(updateStatusKeys.loading);

  useEffect(() => {
    const checkLastPublishDate = async () => {
      const surveyRemote = await SurveyService.fetchSurveySummaryRemote({
        id: survey.remoteId,
        name: surveyName,
      });
      if (!surveyRemote) {
        setUpdateStatus(updateStatusKeys.error);
      } else if (
        Dates.isAfter(
          surveyRemote?.datePublished ?? surveyRemote?.dateModified,
          survey.datePublished ?? survey.dateModified
        )
      ) {
        setUpdateStatus(updateStatusKeys.notUpToDate);
      } else {
        setUpdateStatus(updateStatusKeys.upToDate);
      }
    };
    if (!networkAvailable) {
      setUpdateStatus(updateStatusKeys.networkNotAvailable);
    } else if (survey) {
      checkLastPublishDate();
    }
  }, [networkAvailable, survey]);

  if (!survey) return null;

  return (
    <FieldSet heading="surveys:currentSurvey" style={styles.fieldset}>
      <VView style={styles.internalContainer}>
        <HView style={styles.titleContainer}>
          <Text textKey={surveyTitle} variant="titleMedium" />
          <UpdateStatusIcon updateStatus={updateStatus} />
        </HView>
        <Button
          textKey="dataEntry:goToDataEntry"
          onPress={() => navigation.navigate(screenKeys.recordsList)}
        />
      </VView>
    </FieldSet>
  );
};
