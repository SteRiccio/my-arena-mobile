import {
  HomeScreen,
  LoginScreen,
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
    title: "My Arena Mobile",
    component: HomeScreen,
  },
  [screenKeys.login]: {
    ...screenDefaults,
    title: "Login",
    component: LoginScreen,
  },
  [screenKeys.recordsList]: {
    ...screenDefaults,
    title: "Records List",
    component: RecordsList,
  },
  [screenKeys.recordEditor]: {
    ...screenDefaults,
    title: "Record Editor",
    hasBack: false,
    hasDrawer: true,
    component: RecordEditor,
  },
  [screenKeys.surveysListLocal]: {
    ...screenDefaults,
    title: "Surveys in the device",
    component: SurveysListLocal,
  },
  [screenKeys.surveysListRemote]: {
    ...screenDefaults,
    title: "Surveys in the cloud",
    component: SurveysListRemote,
  },
  [screenKeys.settings]: {
    ...screenDefaults,
    title: "Settings",
    component: SettingsScreen,
  },
};
