// import { lazy } from "react";

import HomeScreen from "./HomeScreen";

import RecordEditor from "./RecordEditor";
import RecordsList from "./RecordsList";
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
  [screenKeys.home]: {
    ...screenDefaults,
    title: "common:appTitle",
    component: HomeScreen,
  },
  [screenKeys.recordsList]: {
    ...screenDefaults,
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
    title: "surveys:surveysInTheDevice",
    component: SurveysListLocal,
  },
  [screenKeys.surveysListRemote]: {
    ...screenDefaults,
    title: "surveys:surveysInTheCloud",
    component: SurveysListRemote,
  },
};
