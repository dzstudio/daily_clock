/**
 * Tuhu Clock
 *
 * @Author Dillon Zhang
 * @Date 2019年10月15日
 */

import React, {Component} from 'react';
import moment from 'moment';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {setStatsDetail} from '../../actions';
import Utils from '../../utils';
import {
  IconGood,
  IconOver,
  IconWrong,
  IconException,
  IconDetail,
} from '../../assets';

class Stats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentYear: '-',
      currentMonth: '-',
      clockCount: 0,
      overCount: 0,
      lateCount: 0,
      exceptionCount: 0,
      monthClocks: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    let today = new Date();
    this.generateMonthClocks();
    this.updateStatsBoard(today.getFullYear(), today.getMonth());
  }

  componentWillReceiveProps() {
    this.generateMonthClocks();
    this.updateStatsBoard(this.state.currentYear, this.state.currentMonth);
  }

  generateMonthClocks = () => {
    const {clocks} = this.props;
    let monthClocks = [];
    // eslint-disable-next-line no-unused-vars
    for (let i in clocks) {
      let year = clocks[i];
      // eslint-disable-next-line no-unused-vars
      for (let j in year) {
        monthClocks.push({
          year: i,
          month: j,
          data: year[j],
        });
      }
    }

    this.setState({monthClocks});
  };

  handleOnRefresh = () => {
    this.setState({
      refreshing: true,
    });

    this.generateMonthClocks();
    this.updateStatsBoard(this.state.currentYear, this.state.currentMonth);

    this.setState({
      refreshing: false,
    });
  };

  render() {
    return (
      <>
        <SafeAreaView style={styles.container}>
          <View style={styles.dashboard}>
            <Text style={styles.titleDate}>
              {this.state.currentYear +
                '年' +
                this.state.currentMonth +
                '月统计'}
            </Text>
            <View style={styles.statsBlockWrap}>
              <View style={styles.statsBlock}>
                <Image style={styles.statsIcon} source={IconGood} />
                <Text style={styles.statsTxt}>
                  打卡
                  <Text style={styles.statsTxtBold}>
                    {' ' + this.state.clockCount + ' '}
                  </Text>
                  天
                </Text>
              </View>
              <View style={styles.statsBlock}>
                <Image style={styles.statsIcon} source={IconOver} />
                <Text style={styles.statsTxt}>
                  加班
                  <Text style={styles.statsTxtBold}>
                    {' ' + this.state.overCount + ' '}
                  </Text>
                  天
                </Text>
              </View>
            </View>
            <View style={styles.statsBlockWrap}>
              <View style={styles.statsBlock}>
                <Image style={styles.statsIcon} source={IconWrong} />
                <Text style={styles.statsTxt}>
                  迟到
                  <Text style={styles.statsTxtBold}>
                    {' ' + this.state.lateCount + ' '}
                  </Text>
                  天
                </Text>
              </View>
              <View style={styles.statsBlock}>
                <Image style={styles.statsIcon} source={IconException} />
                <Text style={styles.statsTxt}>
                  异常
                  <Text style={styles.statsTxtBold}>
                    {' ' + this.state.exceptionCount + ' '}
                  </Text>
                  天
                </Text>
              </View>
            </View>
          </View>
          <FlatList
            style={styles.scrollViewWrap}
            contentContainerStyle={styles.scrollView}
            data={this.state.monthClocks}
            renderItem={this.renderMonthView}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => String(item.month + '')}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshing={false}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={
              <Text style={styles.emptyList}>暂无打卡数据</Text>
            }
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handleOnRefresh}
                title="下拉刷新"
              />
            }
          />
        </SafeAreaView>
      </>
    );
  }

  renderMonthView = ({item}) => {
    let selectedStyle =
      item.year + '' === this.state.currentYear + '' &&
      item.month + '' === this.state.currentMonth + ''
        ? styles.statsItemSelected
        : null;

    return (
      <View style={styles.statsItemWrap}>
        <TouchableOpacity
          onPress={() => {
            this.updateStatsBoard(item.year, item.month);
          }}
          style={styles.statsItem}>
          <Text style={[styles.statsItemTxt, selectedStyle]}>
            {item.year}年{item.month}月数据
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.viewStatsDetail(item.year, item.month);
          }}
          style={styles.statsItemIconWrap}>
          <Image style={styles.statsItemIcon} source={IconDetail} />
        </TouchableOpacity>
      </View>
    );
  };

  viewStatsDetail = (year, month) => {
    const {dispatch} = this.props;
    dispatch(
      setStatsDetail({
        year: year,
        month: month,
      }),
    );

    Actions.statsdetail();
  };

  optTimeTxt = text => {
    let txt = text + '';
    if (txt.length === 1) {
      txt = '0' + txt;
    }
    return txt;
  };

  updateStatsBoard = (year, month) => {
    const {
      clocks,
      lateLineHour,
      lateLineMin,
      overLineHour,
      overLineMin,
    } = this.props;

    let clockCount = 0;
    let overCount = 0;
    let lateCount = 0;
    let exceptionCount = 0;

    let data = clocks[year] ? clocks[year][month] : null;
    if (data) {
      // eslint-disable-next-line no-unused-vars
      for (let i in data) {
        let clock = data[i];
        clockCount++;
        if (
          (!clock.onClock || !clock.offClock) &&
          (clock.onClock || clock.offClock)
        ) {
          if (
            moment(new Date()).format('YYYY-MM-DD') !==
              moment(Utils.strToDate(clock.offClock)).format('YYYY-MM-DD') &&
            moment(new Date()).format('YYYY-MM-DD') !==
              moment(Utils.strToDate(clock.onClock)).format('YYYY-MM-DD')
          ) {
            exceptionCount++;
          }
        }
        if (clock.onClock) {
          let onClock = Utils.strToDate(clock.onClock);
          if (
            onClock.getHours() > lateLineHour ||
            (onClock.getMinutes() > lateLineMin &&
              onClock.getHours() === lateLineHour)
          ) {
            lateCount++;
          }
        }
        if (clock.offClock) {
          let offClock = Utils.strToDate(clock.offClock);
          if (
            offClock.getHours() > overLineHour ||
            (offClock.getMinutes() > overLineMin &&
              offClock.getHours() === overLineHour)
          ) {
            let onClock = Utils.strToDate(clock.onClock);
            let dateTxt =
              moment(offClock).format('YYYY-MM-DD') +
              ' ' +
              this.optTimeTxt(overLineHour) +
              ':' +
              this.optTimeTxt(overLineMin) +
              ':00';
            let lateTxt =
              moment(offClock).format('YYYY-MM-DD') +
              ' ' +
              this.optTimeTxt(lateLineHour) +
              ':' +
              this.optTimeTxt(lateLineMin) +
              ':00';
            // 加班时长
            let offStamp =
              offClock.getTime() - Utils.strToDate(dateTxt).getTime();
            // 迟到时长
            let lateStamp =
              onClock.getTime() - Utils.strToDate(lateTxt).getTime();

            if (offStamp >= lateStamp && lateStamp <= 2 * 60 * 60 * 1000) {
              overCount++;
            }
          }
        }
      }
    }

    this.setState({
      currentYear: year,
      currentMonth: month,
      clockCount: clockCount,
      overCount: overCount,
      lateCount: lateCount,
      exceptionCount: exceptionCount,
    });
  };
}

export default connect(({clock, settings}) => ({
  clocks: clock.clocks,
  lateLineHour: settings.lateLineHour,
  lateLineMin: settings.lateLineMin,
  overLineHour: settings.overLineHour,
  overLineMin: settings.overLineMin,
}))(Stats);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scrollViewWrap: {
    width: '100%',
    backgroundColor: '#fff',
  },
  scrollView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleDate: {
    fontSize: 40,
    marginHorizontal: Utils.getZoomValue(25),
    marginTop: Utils.getZoomValue(35),
    marginBottom: Utils.getZoomValue(40),
  },
  dashboard: {
    width: '100%',
    height: Utils.getZoomValue(300),
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  statsBlockWrap: {
    flex: 1,
    width: Utils.getZoomValue(343),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsBlock: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignContent: 'center',
  },
  statsIcon: {
    width: Utils.getZoomValue(24),
    height: Utils.getZoomValue(24),
    marginBottom: Utils.getZoomValue(10),
  },
  statsTxt: {
    flex: 1,
    fontSize: Utils.getZoomValue(18),
  },
  statsTxtBold: {
    color: '#FFA500',
    fontSize: Utils.getZoomValue(26),
  },
  statsItemWrap: {
    width: '100%',
    height: Utils.getZoomValue(90),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsItem: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: Utils.getZoomValue(30),
  },
  statsItemTxt: {
    fontSize: Utils.getZoomValue(26),
    color: '#A9A9A9',
  },
  statsItemSelected: {
    color: '#FFA500',
  },
  statsItemIconWrap: {
    flex: 1,
    alignItems: 'center',
  },
  statsItemIcon: {
    width: Utils.getZoomValue(28),
    height: Utils.getZoomValue(28),
  },
  separator: {
    height: 1,
    backgroundColor: '#f2f2f2',
  },
  emptyList: {
    fontSize: Utils.getZoomValue(26),
    margin: Utils.getZoomValue(40),
    color: '#D3D3D3',
  },
});
