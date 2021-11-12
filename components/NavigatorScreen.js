import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './Home/Home.view';
import ImagesView from './ImageViewer/Images.view';
import ImageViewer from './ImageViewer/ImageViewer.view';
import LoginView from './Login/Login.view';
import ManageView from './Manage/Manage.view';
import RegistrationView from './Registration/Registration.view';
import VideoView from './Video/Video.view';
import RFIDView from './Manage/RFID.view';

const HomeNavigator = createStackNavigator(
  {
    Login: {
      screen: LoginView,
    },
    Registration: {
      screen: RegistrationView,
    },
    Home: {
      screen: Home,
    },
    Image: {
      screen: ImageViewer,
    },
    Images: {
      screen: ImagesView,
    },
    Video: {
      screen: VideoView,
    },
    RFID: {
      screen: RFIDView,
    },
    Manage: {
      screen: ManageView,
    },
  },
  {initialRouteName: 'Login'},
);

export default createAppContainer(HomeNavigator);
