import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MainTextField from '../SubComponents/MainTextField';

var configjson = require('../../config.json');
const screenWidth = Dimensions.get('window').width;
const buttonHeight = 40;
const screenHeight = Dimensions.get('window').height;
const logoHeight = 40;

const paddingToLoading = screenHeight / 2 - logoHeight;

const IOS_BOTTOM_PADDING = screenHeight / screenWidth >= 2 ? 30 : 10;

class LoginView extends Component {
  //   static navigationOptions = {
  //     header: null,
  //   };
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      usernameError: '',
      passwordError: '',
    };
  }

  componentDidMount() {
    this.getData(true);
    const unsubscribe = this.props.navigation.addListener('willFocus', () => {
      this.getData(false);
    });
  }

  getData = async login => {
    try {
      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('password');
      console.log('username', username);
      console.log('password', password);
      if (username !== null && password != null) {
        this.setState({username, password}, () => {
          if (login) this.login(username, password);
        });
      }
    } catch (e) {
      console.log('ERROR:', e);
    }
  };

  handleLoginButton() {
    this.removeFocusFromTextFields();

    this.login(
      this.usernameTextField.state.value,
      this.passwordTextField.state.value,
    );
  }

  login(username, password) {
    let formData = new FormData();
    formData.append('user_name', username);
    formData.append('password', password);

    const url = configjson.base_url + 'login_postman/login.php';

    this.setState({loading: true});

    fetch(url, {
      method: 'POST',
      body: formData,
    }).then(response => {
      this.setState({loading: false});

      if (response.status >= 300) {
        switch (response.status) {
          case 412:
            Alert.alert('ERROR:', 'Incorrect Username or Password form!');
            break;
          case 402:
            Alert.alert('ERROR:', 'Not a valid username or password!');
            break;
        }
        return;
      }
      response.json().then(res => {
        AsyncStorage.setItem('username', username);
        AsyncStorage.setItem('password', password);
        AsyncStorage.setItem('token', response.headers.map.token);
        AsyncStorage.setItem('email', res.email);

        this.props.navigation.navigate('Home');
      });
    });
  }

  removeFocusFromTextFields() {
    this.usernameTextField.blur();
    this.passwordTextField.blur();
  }

  handleRegisterButton() {
    this.props.navigation.navigate('Registration');
  }

  renderPage() {
    if (this.state.loading) {
      return (
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View style={{height: '100%', width: '100%', backgroundColor: 'white'}}>
        <View style={{paddingVertical: 25, paddingHorizontal: 10}}>
          <MainTextField
            ref={c => (this.usernameTextField = c)}
            value={this.state.username}
            error={this.state.usernameError}
            label={'Username'}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => {
              this.setState({usernameError: ''});
            }}
          />

          <MainTextField
            ref={c => (this.passwordTextField = c)}
            value={this.state.password}
            error={this.state.passwordError}
            label={'Password'}
            autoCapitalize="none"
            secureTextEntry={true}
            title={'Minimum 6 characters!'}
            onFocus={() => {
              this.setState({passwordError: ''});
            }}
          />
        </View>

        <TouchableOpacity
          style={{
            //backgroundColor: this.props.app_options.app_button_bg_color,
            borderRadius: 20,
            width: '90%',
            height: buttonHeight,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => this.handleLoginButton()}>
          <Text style={{textAlign: 'center', fontSize: 15, color: 'black'}}>
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            //backgroundColor: this.props.app_options.app_button_bg_color,
            borderRadius: 20,
            width: '90%',
            height: buttonHeight,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => this.handleRegisterButton()}>
          <Text style={{textAlign: 'center', fontSize: 15, color: 'black'}}>
            Registration
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return <View>{this.renderPage()}</View>;
  }
}

export default LoginView;
