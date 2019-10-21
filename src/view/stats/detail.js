/**
 * Tuhu Clock
 *
 * @Author Dillon Zhang
 * @Date 2019年10月15日
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Utils from '../../utils';

class StatsDetail extends Component {
  constructor(props) {
    super(props);

    const {clocks, statsYear, statsMonth} = props;
    let dailyClocks = [];
    let yearPart = clocks[statsYear] ? clocks[statsYear] : {};
    let monthPart = yearPart[statsMonth] ? yearPart[statsMonth] : {};
    // eslint-disable-next-line no-unused-vars
    for (let i in monthPart) {
      dailyClocks.push({
        year: statsYear,
        month: statsMonth,
        date: i,
        data: monthPart[i],
      });
    }

    this.state = {
      dailyClocks: dailyClocks,
    };
  }

  render() {
    return (
      <>
        <SafeAreaView style={styles.container}>
          <FlatList
            contentContainerStyle={styles.scrollView}
            data={this.state.dailyClocks}
            renderItem={this.renderMonthView}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => String(item.date + '')}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshing={false}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={
              <Text style={styles.emptyList}>暂无打卡数据</Text>
            }
          />
        </SafeAreaView>
      </>
    );
  }

  renderMonthView = ({item}) => {
    return (
      <View style={styles.statsItemWrap}>
        <View style={styles.statsItem}>
          <Text style={styles.statsItemTxt}>
            {item.year}年{item.month}月{item.date}&nbsp;&nbsp;&nbsp;&nbsp;状态：
            {this.checkClockStatus(item.data)}
          </Text>
          <Text style={styles.statsItemTxt}>
            上班打卡：{item.data.onClock ? item.data.onClock : '未打卡'}
          </Text>
          <Text style={styles.statsItemTxt}>
            下班打卡：{item.data.offClock ? item.data.offClock : '未打卡'}
          </Text>
        </View>
      </View>
    );
  };

  optTimeTxt = text => {
    let txt = text + '';
    if (txt.length === 1) {
      txt = '0' + txt;
    }
    return txt;
  };

  checkClockStatus = item => {
    const {
      lateLineHour,
      lateLineMin,
      overLineHour,
      overLineMin,
      offLineHour,
      offLineMin,
    } = this.props;

    let status = '正常';
    let style = '';
    let onClock = Utils.strToDate(item.onClock);
    let offClock = Utils.strToDate(item.offClock);

    if (!item.onClock) {
      status = '早上未打卡';
      style = 'statusWrong';
    } else if (!item.offClock) {
      status = '下班未打卡';
      style = 'statusWrong';
    } else if (
      onClock.getHours() > lateLineHour ||
      (onClock.getMinutes() > lateLineMin &&
        onClock.getHours() === lateLineHour)
    ) {
      status = '迟到';
      style = 'statusWrong';
    } else if (
      offClock.getHours() < offLineHour &&
      offClock.getMinutes() < offLineMin
    ) {
      status = '早退';
      style = 'statusWrong';
    }
    if (
      onClock &&
      offClock &&
      (offClock.getHours() > overLineHour ||
        (offClock.getMinutes() > overLineMin &&
          offClock.getHours() === overLineHour))
    ) {
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
      let offStamp = offClock.getTime() - Utils.strToDate(dateTxt).getTime();
      // 迟到时长
      let lateStamp = onClock.getTime() - Utils.strToDate(lateTxt).getTime();

      if (offStamp >= lateStamp && lateStamp <= 2 * 60 * 60 * 1000) {
        status = '加班';
        style = 'statusGood';
      }
    }
    return <Text style={style ? styles[style] : null}>{status}</Text>;
  };
}

export default connect(({clock, settings}) => ({
  clocks: clock.clocks,
  statsYear: clock.statsYear,
  statsMonth: clock.statsMonth,
  lateLineHour: settings.lateLineHour,
  lateLineMin: settings.lateLineMin,
  offLineHour: settings.offLineHour,
  offLineMin: settings.offLineHour,
  overLineHour: settings.overLineHour,
  overLineMin: settings.overLineMin,
}))(StatsDetail);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
  },
  scrollView: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statusGood: {
    color: '#3CB371',
  },
  statusWrong: {
    color: '#FF6347',
  },
  statsItemWrap: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: Utils.getZoomValue(20),
    paddingVertical: Utils.getZoomValue(10),
  },
  statsItemTxt: {
    fontSize: Utils.getZoomValue(16),
    lineHeight: Utils.getZoomValue(26),
    color: '#A9A9A9',
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
