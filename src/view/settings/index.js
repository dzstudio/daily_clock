/**
 * Tuhu Clock
 *
 * @Author Dillon Zhang
 * @Date 2019年10月15日
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {getSettings} from '../../service';
import {setSettings} from '../../actions';
import Utils from '../../utils';
import {IconDetail} from '../../assets';
import {Actions} from 'react-native-router-flux';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    const {
      lateLineHour,
      lateLineMin,
      offLineHour,
      offLineMin,
      overLineHour,
      overLineMin,
      nickName,
    } = this.props.settings;

    return (
      <>
        <SafeAreaView style={styles.containter}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={styles.scrollView}>
            <View style={styles.statsItem}>
              <Text style={styles.statsItemTxt}>
                昵称：{nickName ? nickName : '未设置'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Actions.editnickname();
                }}
                style={styles.statsItemIconWrap}>
                <Image style={styles.statsItemIcon} source={IconDetail} />
              </TouchableOpacity>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsItemTxt}>
                迟到时间点：{this.optTimeTxt(lateLineHour)}:
                {this.optTimeTxt(lateLineMin)}
              </Text>
              {/* <TouchableOpacity
                onPress={() => {}}
                style={styles.statsItemIconWrap}>
                <Image style={styles.statsItemIcon} source={IconDetail} />
              </TouchableOpacity> */}
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsItemTxt}>
                下班时间点：{this.optTimeTxt(offLineHour)}:
                {this.optTimeTxt(offLineMin)}
              </Text>
              {/* <TouchableOpacity
                onPress={() => {}}
                style={styles.statsItemIconWrap}>
                <Image style={styles.statsItemIcon} source={IconDetail} />
              </TouchableOpacity> */}
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsItemTxt}>
                加班时间点：{this.optTimeTxt(overLineHour)}:
                {this.optTimeTxt(overLineMin)}
              </Text>
              {/* <TouchableOpacity
                onPress={() => {}}
                style={styles.statsItemIconWrap}>
                <Image style={styles.statsItemIcon} source={IconDetail} />
              </TouchableOpacity> */}
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

export default connect(({settings}) => ({settings}))(Settings);

const styles = StyleSheet.create({
  containter: {
    backgroundColor: '#fff',
  },
  scrollView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statsItem: {
    height: Utils.getZoomValue(90),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: Utils.getZoomValue(30),
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
  },
  statsItemTxt: {
    flex: 2,
    fontSize: Utils.getZoomValue(18),
    color: '#A9A9A9',
    textAlign: 'left',
  },
  statsItemIconWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statsItemIcon: {
    width: Utils.getZoomValue(28),
    height: Utils.getZoomValue(28),
  },
});
