import React from 'react';
import {StatusBar, StyleSheet, Platform, View} from 'react-native';
import {Tabs, Scene, Router, Actions} from 'react-native-router-flux';
import Views from '../view';
import {
  IconClock,
  IconStats,
  IconSettings,
  IconClockDis,
  IconStatsDis,
  IconSettingsDis,
} from '../assets';

const RouterComponent = () => {
  const onBackPress = () => {
    if (Actions.state.index !== 0) {
      if (Actions.currentParams.backNeedRefresh) {
        Actions.pop({refresh: {refreshRandom: Math.random()}});
      } else {
        Actions.pop();
      }
      return true;
    }
    return false;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="default" backgroundColor={'white'} />
      <Router backAndroidHandler={onBackPress}>
        <Scene key="main" hideNavBar hideTabBar>
          <Scene
            key="statsdetail"
            component={Views.StatsDetail}
            hideNavBar={false}
            title="统计详情"
          />
          <Scene
            key="editnickname"
            component={Views.Nickname}
            hideNavBar={false}
            title="编辑昵称"
          />
          <Tabs key="tabBar" tabBarComponent={Views.MainTab} initial>
            <Scene
              key="clock"
              component={Views.Clock}
              title="打卡"
              icon={IconClock}
              inactiveIcon={IconClockDis}
              hideNavBar
            />
            <Scene
              key="stats"
              component={Views.Stats}
              title="统计"
              icon={IconStats}
              inactiveIcon={IconStatsDis}
              hideNavBar
            />
            <Scene
              key="settings"
              component={Views.Settings}
              title="设置"
              icon={IconSettings}
              inactiveIcon={IconSettingsDis}
              hideNavBar
            />
          </Tabs>
        </Scene>
      </Router>
    </View>
  );
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationBarStyle: {
    backgroundColor: '#5db2ef',
    borderBottomWidth: 0,
    elevation: 0,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
});

export default RouterComponent;
