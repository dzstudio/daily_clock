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
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import Utils from '../../utils';
import AwesomeAlert from 'react-native-awesome-alerts';
import {IconGoToWork, IconHaveRest} from '../../assets';
import {
  loadClocks,
  getTodayClock,
  setOnClock,
  setOffClock,
  getSettings,
} from '../../service';
import {setCheckIn, setCheckOut, setClocks, setSettings} from '../../actions';
import moment from 'moment';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      alertMsg: '',
      welcomeMsg: '',
    };
  }

  componentDidMount() {
    this.readClocks();
    this.readSettings();
    this.updateWelcomeMsg();
    this.timer = setInterval(() => {
      this.updateWelcomeMsg();
    }, 1000);
  }

  async readClocks() {
    const {dispatch} = this.props;

    let clocks = await loadClocks();
    let todayClock = await getTodayClock();

    dispatch(
      setCheckIn({
        onClock: todayClock.onClock,
      }),
    );

    dispatch(
      setCheckOut({
        offClock: todayClock.offClock,
      }),
    );

    dispatch(
      setClocks({
        clocks: clocks,
      }),
    );
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

  async updateWelcomeMsg() {
    const {offLineHour, offLineMin, nickName} = this.props;

    let msg = '';
    let today = new Date();
    let hour = today.getHours();
    let todayClock;

    if (hour > 0 && hour < 5) {
      msg = '凌晨好，请注意休息';
      this.setState({
        welcomeMsg: msg,
      });
      return;
    }

    if (hour >= 5 && hour < 10) {
      msg = '早上好';
    } else if (hour >= 10 && hour < 12) {
      msg = '上午好';
    } else if (hour >= 12 && hour < 15) {
      msg = '中午好';
    } else if (hour >= 15 && hour < 18) {
      msg = '下午好';
    } else if (hour >= 18) {
      msg = '晚上好';
    }
    if (nickName) {
      msg += nickName;
    }

    if (hour < 11 || hour >= offLineHour) {
      todayClock = await getTodayClock();
    }
    if (hour < 11 && !todayClock.onClock) {
      msg += '，请及时打卡~';
    } else if (hour < offLineHour) {
      let dateTxt =
        moment().format('YYYY-MM-DD') +
        ' ' +
        this.optTimeTxt(offLineHour) +
        ':' +
        this.optTimeTxt(offLineMin) +
        ':00';
      let offWorkTime = Utils.strToDate(dateTxt);
      let stamp = offWorkTime.getTime() / 1000 - today.getTime() / 1000;
      let h = Math.floor(stamp / 3600);
      let m = Math.floor((stamp - h * 3600) / 60);
      let s = Math.floor(stamp - h * 3600 - m * 60);

      msg += '，距离下班还剩' + h + '小时' + m + '分' + s + '秒';
    } else if (hour >= 18) {
      if (!todayClock.offClock) {
        msg += '，下班了请及时打卡~';
      } else {
        msg += '，已下班，嗨起来~';
      }
    }

    if (msg !== this.state.welcomeMsg) {
      this.setState({
        welcomeMsg: msg,
      });
    }
  }

  optTimeTxt = text => {
    let txt = text + '';
    if (txt.length === 1) {
      txt = '0' + txt;
    }
    return txt;
  };

  render() {
    const {showAlert, alertMsg} = this.state;
    const {checkInTime, checkOutTime} = this.props;

    return (
      <>
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={styles.scrollView}>
            <Text style={styles.welcomeMsg}>{this.state.welcomeMsg}</Text>
            <TouchableOpacity
              onPress={this._handleOnClock}
              style={styles.btnClock}>
              <Image style={styles.btnClockIcon} source={IconGoToWork} />
              <Text style={styles.btnClockTxt}>上班打卡</Text>
              <Text style={styles.btnClockSubTxt}>
                {checkInTime ? checkInTime : '未打卡'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this._handleOffClock}
              style={[styles.btnClock, styles.btnOffClock]}>
              <Image style={styles.btnClockIcon} source={IconHaveRest} />
              <Text style={styles.btnClockTxt}>下班打卡</Text>
              <Text style={styles.btnClockSubTxt}>
                {checkOutTime ? checkOutTime : '未打卡'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="提示"
          message={alertMsg}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="好"
          confirmButtonColor="#DD6B55"
          confirmButtonStyle={styles.alertBtnStyle}
          contentContainerStyle={styles.alertStyle}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
      </>
    );
  }

  hideAlert() {
    this.setState({
      showAlert: false,
    });
  }

  alert(msg) {
    this.setState({
      alertMsg: msg,
      showAlert: true,
    });
  }

  _handleOnClock = async () => {
    let todayClock = await getTodayClock();
    if (todayClock.onClock) {
      return;
    }

    let result = await setOnClock(new Date());
    if (!result) {
      this.alert('操作失败请重试');
      return;
    }

    this.readClocks();
    this.updateWelcomeMsg();
    this.alert('打卡成功！');
  };

  _handleOffClock = async () => {
    let result = await setOffClock(new Date());
    if (!result) {
      this.alert('操作失败请重试');
      return;
    }

    this.readClocks();
    this.updateWelcomeMsg();
    this.alert('打卡成功！');
  };
}

export default connect(({clock, settings}) => ({
  checkInTime: clock.checkInTime,
  checkOutTime: clock.checkOutTime,
  clocks: clock.clocks,
  offLineHour: settings.offLineHour,
  offLineMin: settings.offLineMin,
  nickName: settings.nickName,
}))(Clock);

const styles = StyleSheet.create({
  container: {
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
  welcomeMsg: {
    fontSize: 36,
    height: 142,
    marginHorizontal: 20,
    marginTop: 35,
    marginBottom: 10,
  },
  alertStyle: {
    width: Utils.getZoomValue(260),
  },
  alertBtnStyle: {
    width: Utils.getZoomValue(200),
    alignItems: 'center',
  },
  btnClock: {
    width: Utils.getZoomValue(343),
    backgroundColor: '#FFD700',
    height: Utils.getZoomValue(135),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: Utils.getZoomValue(50),
    position: 'relative',
  },
  btnOffClock: {
    backgroundColor: '#FFA500',
  },
  btnClockTxt: {
    flex: 1,
    justifyContent: 'center',
    fontSize: Utils.getZoomValue(35),
    color: '#f2f2f2',
    marginTop: Utils.getZoomValue(30),
    marginBottom: Utils.getZoomValue(10),
  },
  btnClockSubTxt: {
    flex: 1,
    color: '#f2f2f2',
    fontSize: Utils.getZoomValue(17),
  },
  btnClockIcon: {
    position: 'absolute',
    top: '50%',
    left: Utils.getZoomValue(36),
    width: Utils.getZoomValue(36),
    height: Utils.getZoomValue(36),
    marginTop: Utils.getZoomValue(-20),
  },
});
