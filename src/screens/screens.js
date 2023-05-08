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

export const screens = {
  [screenKeys.home]: { title: "My Arena Mobile", component: HomeScreen },
  [screenKeys.login]: { title: "Login", component: LoginScreen },
  [screenKeys.recordsList]: { title: "Records List", component: RecordsList },
  [screenKeys.recordEditor]: {
    title: "Record Editor",
    surveyNameAsTitle: true,
    component: RecordEditor,
  },
  [screenKeys.surveysListLocal]: {
    title: "Surveys in the device",
    component: SurveysListLocal,
  },
  [screenKeys.surveysListRemote]: {
    title: "Surveys in the cloud",
    component: SurveysListRemote,
  },
  [screenKeys.settings]: { title: "Settings", component: SettingsScreen },
};
