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

class RegistrationView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      username: '',
      password: '',
      password2: '',
      emailError: '',
      usernameError: '',
      passwordError: '',
      password2Error: '',
    };
  }

  removeFocusFromTextFields() {
    this.emailTextField.blur();
    this.usernameTextField.blur();
    this.passwordTextField.blur();
    this.password2TextField.blur();
  }

  handleRegisterButton() {
    this.register(
      this.emailTextField.state.value,
      this.usernameTextField.state.value,
      this.passwordTextField.state.value,
      this.password2TextField.state.value,
    );
  }

  doSwitchCase(status) {
    switch (status) {
      case 412:
        Alert.alert('ERROR:', 'Incorrect form!');
        break;
      case 409:
        Alert.alert('ERROR:', 'This user is already registered!');
        break;
      case 406:
        Alert.alert('ERROR:', 'Passwords do not match!');
        break;
      case 400:
        Alert.alert('ERROR:', 'Missing information!');
        break;
    }
  }

  register(email, username, password, password2) {
    let formData = new FormData();
    formData.append('email', email);
    formData.append('user_name', username);
    formData.append('password', password);
    formData.append('password2', password2);

    const url = configjson.base_url + 'login_postman/signup.php';

    this.setState({loading: true});

    fetch(url, {
      method: 'POST',
      body: formData,
    }).then(response => {
      this.setState({loading: false});

      if (response.status >= 300) {
        this.doSwitchCase(response.status);
        return;
      }
      response.json().then(res => {
        if (res.status) {
          AsyncStorage.setItem('email', email);
          AsyncStorage.setItem('username', username);
          AsyncStorage.setItem('password', password);

          this.props.navigation.navigate('Login');
          Alert.alert('Signed up!', 'Welcome!');
        }
      });
    });
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
      <View style={{height: '100%'}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '600',
            color: 'black',
          }}>
          Registration
        </Text>
        <View style={{paddingVertical: 25, paddingHorizontal: 10}}>
          {/*EMAIL*/}
          <MainTextField
            ref={c => (this.emailTextField = c)}
            value={this.state.email}
            error={this.state.emailError}
            label={'E-Mail'}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => {
              this.setState({emailError: ''});
            }}
          />

          {/*USERNAME*/}
          <MainTextField
            ref={c => (this.usernameTextField = c)}
            value={this.state.username}
            error={this.state.usernameError}
            label={'Username'}
            autoCapitalize="none"
            onFocus={() => {
              this.setState({usernameError: ''});
            }}
          />

          {/*PASSWORD*/}
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

          {/*REPEAT PASSWORD*/}
          <MainTextField
            ref={c => (this.password2TextField = c)}
            value={this.state.password2}
            error={this.state.password2Error}
            label={'Repeat Password'}
            autoCapitalize="none"
            secureTextEntry={true}
            title={'Minimum 6 characters!'}
            onFocus={() => {
              this.setState({password2Error: ''});
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

export default RegistrationView;
