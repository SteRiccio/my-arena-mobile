// import { lazy } from "react";

import HomeScreen from "./HomeScreen";

import AboutScreen from "./AboutScreen";
import RecordEditor from "./RecordEditor";
import RecordsList from "./RecordsList";
import RecordValidationReport from "./RecordValidationReport";
import SettingsScreen from "./SettingsScreen";
import SettingsRemoteConnectionScreen from "./SettingsRemoteConnectionScreen";
import SurveysListLocal from "./SurveysListLocal";
import SurveysListRemote from "./SurveysListRemote";

// const RecordEditor = lazy(() => import("./RecordEditor"));
// const RecordsList = lazy(() => import("./RecordsList"));
// const SettingsScreen = lazy(() => import("./SettingsScreen"));
// const SettingsRemoteConnectionScreen = lazy(() =>
//   import("./SettingsRemoteConnectionScreen")
// );
// const SurveysListLocal = lazy(() => import("./SurveysListLocal"));
// const SurveysListRemote = lazy(() => import("./SurveysListRemote"));

import { screenKeys } from "./screenKeys";

const screenDefaults = {
  hasBack: true,
  hasDrawer: true,
  surveyNameAsTitle: false,
};

export const screens = {
  [screenKeys.about]: {
    ...screenDefaults,
    title: "common:about",
    component: AboutScreen,
  },
  [screenKeys.home]: {
    ...screenDefaults,
    title: "common:appTitle",
    component: HomeScreen,
  },
  [screenKeys.recordsList]: {
    ...screenDefaults,
    hasToggleScreenView: true,
    title: "dataEntry:listOfRecords",
    component: RecordsList,
  },
  [screenKeys.recordEditor]: {
    ...screenDefaults,
    title: "dataEntry:recordEditor",
    hasBack: false,
    hasDrawer: true,
    component: RecordEditor,
  },

  [screenKeys.recordValidationReport]: {
    ...screenDefaults,
    hasToggleScreenView: true,
    title: "dataEntry:validationReport.title",
    component: RecordValidationReport,
  },
  [screenKeys.settings]: {
    ...screenDefaults,
    title: "settings:title",
    component: SettingsScreen,
  },
  [screenKeys.settingsRemoteConnection]: {
    ...screenDefaults,
    title: "settingsRemoteConnection:title",
    component: SettingsRemoteConnectionScreen,
  },
  [screenKeys.surveysListLocal]: {
    ...screenDefaults,
    hasToggleScreenView: true,
    title: "surveys:surveysInTheDevice",
    component: SurveysListLocal,
  },
  [screenKeys.surveysListRemote]: {
    ...screenDefaults,
    hasToggleScreenView: true,
    title: "surveys:surveysInTheCloud",
    component: SurveysListRemote,
  },
};
