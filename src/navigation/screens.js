import { HomeScreen } from "../screens/HomeScreen";
import { RecordEditor } from "../screens/RecordEditor/RecordEditor";
import { RecordsList } from "../screens/RecordsList";
import { SettingsScreen } from "../screens/SettingsScreen";
import { SurveysListLocal } from "../screens/SurveysListLocal";
import { SurveysListRemote } from "../screens/SurveysListRemote";

export const screenKeys = {
  home: "home",
  recordsList: "recordsList",
  recordEditor: "recordEditor",
  surveysListLocal: "surveysListLocal",
  surveysListRemote: "surveysListRemote",
  settings: "settings",
};

export const screens = {
  [screenKeys.home]: { title: "My Arena Mobile", component: HomeScreen },
  [screenKeys.recordsList]: { title: "Records List", component: RecordsList },
  [screenKeys.recordEditor]: {
    title: "Record Editor",
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
