import React, {Component} from 'react';
import {
  TextInput,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';

const DEFAULT_COLOR = '#5a5a5a';

export default class MainTextField extends Component {
  constructor(props) {
    super(props);

    this.onAccessoryPress = this.onAccessoryPress.bind(this);
    this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

    this.is_on_focus = false;

    this.state = {
      value: '',
      secureTextEntry: false,

      border_width: new Animated.Value(0.5),
      label_font_size: new Animated.Value(16),
      label_top_pos: new Animated.Value(30),

      //is_on_focus: false,
    };
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({value: this.props.value});
      this.fadeIn(false);
    }

    if (this.props.secureTextEntry) {
      this.setState({secureTextEntry: true});
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value != this.props.value) {
      this.setState({value: this.props.value});

      if (this.props.value == '') {
        this.fadeOut(false);
      } else {
        this.fadeIn(false);
      }
    }

    if (prevProps.secureTextEntry != this.props.secureTextEntry) {
      this.setState({secureTextEntry: this.props.secureTextEntry});
    }
  }

  fadeIn = animate_border => {
    //this.setState({ is_on_focus: true })
    this.is_on_focus = true;

    if (animate_border) {
      Animated.timing(this.state.border_width, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }

    Animated.timing(this.state.label_font_size, {
      toValue: 12,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.label_top_pos, {
      toValue: 10,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  fadeOut = animate_border => {
    //this.setState({ is_on_focus: false })
    this.is_on_focus = false;

    if (animate_border) {
      Animated.timing(this.state.border_width, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }

    if (this.state.value == '') {
      Animated.timing(this.state.label_font_size, {
        toValue: 16,
        duration: 200,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.label_top_pos, {
        toValue: 30,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  onAccessoryPress() {
    this.setState(({secureTextEntry}) => ({secureTextEntry: !secureTextEntry}));
  }

  renderPasswordAccessory() {
    let {secureTextEntry} = this.state;

    let color = this.getColor();

    let img = !secureTextEntry
      ? require('../../resources/pw_show_128.png')
      : require('../../resources/pw_notshow_128.png');

    return (
      <TouchableOpacity
        onPress={() => this.onAccessoryPress()}
        style={{
          width: 50,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          right: 0,
          top: 15,
        }}>
        <Image
          style={{width: 30, height: 30, tintColor: color}}
          source={img}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }

  onChangeText(text) {
    this.setState({value: text});
    if (this.props.onChangeText) {
      this.props.onChangeText(text);
    }
  }

  getColor() {
    let color = DEFAULT_COLOR;
    if (this.props.color) {
      color = this.props.color;
    }

    if (this.props.error) {
      if (this.props.errorColor) {
        color = this.props.errorColor;
      } else {
        color = '#ff0000';
      }
    }

    if (this.is_on_focus) {
      if (this.props.color) {
        color = this.props.color;
      } else {
        color = DEFAULT_COLOR;
      }
    }

    if (this.props.editable == false) {
      color = color + '77';
    }

    return color;
  }

  blur() {
    this.textField.blur();
  }

  setValue(value) {
    this.setState({value});

    if (value == '') {
      this.fadeOut(false);
    } else {
      this.fadeIn(false);
    }
  }

  render() {
    let color = this.getColor();

    return (
      <Animated.View
        style={{
          borderBottomWidth: this.state.border_width,
          width: '100%',
          height: 60,
          borderColor: color,
          paddingTop: 10,
          marginTop: 5,
        }}>
        <Animated.Text
          style={{
            color: color,
            fontSize: this.state.label_font_size,
            opacity: 0.7,
            position: 'absolute',
            top: this.state.label_top_pos,
          }}>
          {this.props.label}
        </Animated.Text>

        <View style={{paddingTop: 10}}>
          <TextInput
            ref={c => (this.textField = c)}
            style={{fontSize: 16, color: color, height: 40}}
            value={this.state.value}
            onChangeText={text => this.onChangeText(text)}
            onFocus={() => {
              this.fadeIn(true);
              if (this.props.onFocus) {
                this.props.onFocus();
              }
            }}
            autoFocus={this.props.autoFocus}
            onBlur={() => this.fadeOut(true)}
            keyboardType={this.props.keyboardType}
            autoCapitalize={this.props.autoCapitalize}
            secureTextEntry={this.state.secureTextEntry}
            editable={this.props.editable}></TextInput>
        </View>

        {this.props.secureTextEntry ? this.renderPasswordAccessory() : null}

        {this.props.error ? (
          <Text
            style={{color: color, fontSize: 12, opacity: 0.7, marginTop: 1}}>
            {this.props.error}
          </Text>
        ) : (
          <Text
            style={{color: color, fontSize: 12, opacity: 0.7, marginTop: 1}}>
            {this.props.title}
          </Text>
        )}
      </Animated.View>
    );
  }
}
