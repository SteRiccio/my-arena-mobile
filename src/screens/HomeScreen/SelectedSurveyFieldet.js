import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Dates, Surveys } from "@openforis/arena-core";

import { Button, FieldSet, HView, Text, ViewMoreText, VView } from "components";
import { UpdateStatusIcon } from "components/UpdateStatusIcon";
import { SurveyActions, SurveySelectors } from "state/survey";
import { SurveyService } from "service/surveyService";
import { useIsNetworkConnected } from "hooks/useIsNetworkConnected";
import { useToast } from "hooks/useToast";
import { UpdateStatus } from "model/UpdateStatus";

import { screenKeys } from "../screenKeys";

import styles from "./selectedSurveyFieldsetStyles";
import { RemoteConnectionSelectors } from "state/remoteConnection";

const SurveyUpdateStatusIcon = ({ updateStatus }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toaster = useToast();
  const survey = SurveySelectors.useCurrentSurvey();
  const [loading, setLoading] = useState(false);

  const onPress = () => {
    switch (updateStatus) {
      case UpdateStatus.error:
        toaster.show("surveys:updateStatus.error");
        break;
      case UpdateStatus.networkNotAvailable:
        toaster.show("surveys:updateStatus.networkNotAvailable");
        break;
      case UpdateStatus.upToDate:
        toaster.show("surveys:updateStatus.upToDate");
        break;
      case UpdateStatus.notUpToDate:
        dispatch(
          SurveyActions.updateSurveyRemote({
            surveyId: survey.id,
            surveyName: Surveys.getName(survey),
            surveyRemoteId: survey.remoteId,
            navigation,
            confirmMessageKey:
              "surveys:updateSurveyWithNewVersionConfirmMessage",
            onConfirm: () => setLoading(true),
            onComplete: () => setLoading(false),
          })
        );
        break;
    }
  };
  return (
    <UpdateStatusIcon
      loading={loading}
      updateStatus={updateStatus}
      onPress={onPress}
    />
  );
};

SurveyUpdateStatusIcon.propTypes = {
  updateStatus: PropTypes.string.isRequired,
};

export const SelectedSurveyFieldset = () => {
  const navigation = useNavigation();
  const networkAvailable = useIsNetworkConnected();
  const user = RemoteConnectionSelectors.useLoggedInUser();

  const survey = SurveySelectors.useCurrentSurvey();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const surveyName = Surveys.getName(survey);
  const surveyLabelInDefaultLanguage = Surveys.getLabel(lang)(survey);
  const surveyTitle = surveyLabelInDefaultLanguage
    ? `${surveyLabelInDefaultLanguage} [${surveyName}]`
    : surveyName;
  const surveyDescription = survey?.props?.descriptions?.[lang];
  const [updateStatus, setUpdateStatus] = useState(UpdateStatus.loading);

  useEffect(() => {
    const checkLastPublishDate = async () => {
      if (!user) {
        setUpdateStatus(UpdateStatus.error);
        return;
      }
      const surveyRemote = await SurveyService.fetchSurveySummaryRemote({
        id: survey.remoteId,
        name: surveyName,
      });
      if (!surveyRemote || surveyRemote.errorKey) {
        setUpdateStatus(UpdateStatus.error);
      } else if (
        Dates.isAfter(
          surveyRemote?.datePublished ?? surveyRemote?.dateModified,
          survey.datePublished ?? survey.dateModified
        )
      ) {
        setUpdateStatus(UpdateStatus.notUpToDate);
      } else {
        setUpdateStatus(UpdateStatus.upToDate);
      }
    };
    if (!networkAvailable) {
      setUpdateStatus(UpdateStatus.networkNotAvailable);
    } else if (survey) {
      checkLastPublishDate();
    }
  }, [networkAvailable, survey, user]);

  if (!survey) return null;

  return (
    <FieldSet headerKey="surveys:currentSurvey" style={styles.fieldset}>
      <VView style={styles.internalContainer}>
        <HView style={styles.surveyTitleContainer}>
          <Text style={styles.surveyTitle} variant="titleMedium">
            {surveyTitle}
          </Text>

          <SurveyUpdateStatusIcon updateStatus={updateStatus} />
        </HView>
        {surveyDescription && (
          <ViewMoreText numberOfLines={1}>
            <Text style={styles.surveyTitle} variant="titleSmall">
              {surveyDescription}
            </Text>
          </ViewMoreText>
        )}
        <Button
          style={styles.goToDataEntryButton}
          textKey="dataEntry:goToDataEntry"
          onPress={() => navigation.navigate(screenKeys.recordsList)}
        />
      </VView>
    </FieldSet>
  );
};
