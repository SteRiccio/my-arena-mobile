import {
  HomeScreen,
  SettingsRemoteConnectionScreen,
  RecordEditor,
  RecordsList,
  SettingsScreen,
  SurveysListLocal,
  SurveysListRemote,
} from "screens";
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
