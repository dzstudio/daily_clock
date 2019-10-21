/**
 * Tuhu Clock
 *
 * @Author Dillon Zhang
 * @Date 2019年10月15日
 */

import React, {Component} from 'react';
import {SafeAreaView, TextInput, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {updateSettings, getSettings} from '../../service';
import {setSettings} from '../../actions';
import Utils from '../../utils';

class Nickname extends Component {
  constructor(props) {
    super(props);
    const {nickName} = this.props.settings;
    this.state = {nickName};
  }

  componentDidMount() {
    this.readSettings();
  }

  async readSettings() {
    const {dispatch} = this.props;
    let settings = await getSettings();
    dispatch(
      setSettings({
        ...settings,
      }),
    );
  }

  optTimeTxt = text => {
    let txt = text + '';
    if (txt.length === 1) {
      txt = '0' + txt;
    }
    return txt;
  };

  render() {
    return (
      <>
        <SafeAreaView style={styles.containter}>
          <TextInput
            value={this.state.nickName}
            placeholder="请输入昵称"
            placeholderTextColor="#ccc"
            style={styles.inputItem}
            autoFocus={true}
            onChangeText={this._changeTextHandle}
            returnKeyType="done"
          />
        </SafeAreaView>
      </>
    );
  }

  _changeTextHandle = async text => {
    let nickName = text.trim();
    this.setState({nickName});
    this._saveNickname(nickName);
  };

  _saveNickname = async nickName => {
    const {dispatch} = this.props;
    let settings = await getSettings();
    settings.nickName = nickName;
    await updateSettings(settings);
    dispatch(setSettings({...settings}));
  };
}

export default connect(({settings}) => ({settings}))(Nickname);

const styles = StyleSheet.create({
  containter: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inputItem: {
    width: Utils.getZoomValue(343),
    height: Utils.getZoomValue(50),
    padding: Utils.getZoomValue(10),
    fontSize: Utils.getZoomValue(18),
    textAlign: 'left',
    borderColor: '#f2f2f2',
    borderWidth: 1,
    borderRadius: 6,
    marginVertical: Utils.getZoomValue(20),
  },
});
