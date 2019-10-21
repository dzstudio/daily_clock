/**
 * Tuhu Clock
 *
 * @Author Dillon Zhang
 * @Date 2019年10月15日
 */
import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Utils from '../../utils';

export default class MainTab extends Component {
  render() {
    const {state} = this.props.navigation;
    const activeTabIndex = state.index;

    return (
      <SafeAreaView>
        <View style={styles.mainTabbar}>
          {state.routes.map((element, index) => {
            return activeTabIndex === index ? (
              <TouchableOpacity
                key={index}
                onPress={() => Actions[element.key]()}
                style={[styles.selected, styles.item]}>
                <Image
                  style={styles.tabIcon}
                  source={element.routes[0].params.icon}
                />
                <Text style={styles.tabTxtSelected}>
                  {element.routes[0].params.title}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={index}
                onPress={() => Actions[element.key]()}
                style={styles.item}>
                <Image
                  style={styles.tabIcon}
                  source={element.routes[0].params.inactiveIcon}
                />
                <Text style={styles.tabTxt}>
                  {element.routes[0].params.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainTabbar: {
    width: '100%',
    height: Utils.getZoomValue(60),
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    borderTopColor: '#f2f2f2',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  selected: {
    color: 'red',
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  tabTxt: {
    color: '#ababab',
  },
  tabTxtSelected: {
    color: '#1296db',
  },
});
