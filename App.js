import React from 'react';
import { StyleSheet } from 'react-native';
import { Root } from 'native-base';
import TabBarBottom from './components/stack/barBottom';

export default class App extends React.Component {
  render() {
    return (
      <Root>
        <TabBarBottom style={styles.container}/>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
