import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  login: undefined;
  app: undefined;
  driver: undefined;
  'not-found': undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const DefaultExport = () => null;
export default DefaultExport;