import React from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements';
import SingleCardView from 'react-native-simple-card';

import URL from '../../config';
import api from '../../services/fetchProductos';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class Productos extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        loading: false,      
        data: [],      
        error: null,
        }
     
        this.arrayholder = [] ;
      }
    
    async componentDidMount() {
        const categorias = await api.fetchCategoria();

        this.setState({ data: categorias, loading: false});
        this.arrayholder = productos;
    }

    SearchFilterFunction = text => {    
        const newData = this.arrayholder.filter(item => {      
          const itemData = `${item.marca_producto_id}`;
           const textData = text.toUpperCase();
           return itemData.indexOf(textData) > -1;    
        });    
        this.setState({ data: newData });  
    };

  render() {
    return (
      <View style={styles.container}>
          <FlatList
          data={this.state.data}
          renderItem={({item}) => <Text style={styles.texto}>{item.id}</Text>}
          keyExtractor={item => item.id.toString()} />
      </View>
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
  card: {
      flex: 1,
  },
  btnCard: {
      flex: 1,
  },
  texto: {
    color: 'gray',
    fontSize: 18, 
    marginLeft: 10, 
    textAlign: 'auto'
  },
  lista: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1', 
    marginBottom: 5,
    marginLeft: 5,
    minHeight: 55,
    marginHorizontal: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});