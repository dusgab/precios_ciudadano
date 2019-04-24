import React from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SearchBar, ListItem } from 'react-native-elements';
import SingleCardView from 'react-native-simple-card';

import URL from '../../config';
import api from '../../services/fetchProductos';
import { ScrollView } from 'react-native-gesture-handler';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class Productos extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        loading: false,
        produtos: [],      
        error: null,
        }
     
        this.arrayholder = [] ;
      }

      _keyExtractor = (item, index) => item.id;
    
    async componentDidMount() {
        const productos = await api.fetchProductos();
        this.setState({ productos });
        //const productos = await fetch(URL + 'producto_supermercado');
        // const requestProductos = new Request(URL + 'producto_supermercado', 
        // {method: 'GET'});

        // fetch(requestProductos)
        //   .then(response => {
        //     if (response.status === 200) {
        //       respuesta = JSON.parse(response._bodyText);
        //       this.setState({data: respuesta});
        //       //console.log(respuesta);
        //       console.log('prod');
        //       console.log(this.state.data);
        //     }
        //     else {
        //       console.log("Error en productos");
        //       console.log(respuesta.status);
        //     }
        //   })
        //this.setState({ data: JSON.stringify(requestProductos), loading: false});

        // try {
        //   //Assign the promise unresolved first then get the data using the json method. 
        //   const response = await fetch(URL + 'producto_supermercado');
        //   const json = await response.json();
        //   //const prod = await JSON.parse(productos);
        //   this.setState({data: json.results});
        //   console.log(json);
        //   console.log(this.state.data);
        // } catch(err) {
        //           console.log("Error fetching data-----------", err);
        // }
        //this.arrayholder = this.state.data;
    }

    componentWillMount() {

      //this.getProductos();
    }

    getProductos = () => {
      const requestProductos = new Request(URL + 'producto_supermercado', 
        {method: 'GET'});

        fetch(requestProductos)
          .then(response => {
            if (response.status === 200) {
              const productos = response.json();
              this.setState({productos});
              console.log('prod');
              console.log(this.state.productos);
            }
            else {
              console.log("Error en productos");
              console.log(respuesta.status);
            }
          })
    }

    renderizar = () => {
      let listado = [];
      for (let index = 0; index < this.state.data.length; index++) {
        listado.push(<ListItem key={'id' + index}
          title={"marca prod id" + data[index].id }/>
        )
      }
    }

    SearchFilterFunction = text => {    
        const newData = this.arrayholder.filter(item => {      
          const itemData = `${item.marca_producto_id}`;
           const textData = text.toUpperCase();
           return itemData.indexOf(textData) > -1;    
        });    
        this.setState({ data: newData });  
    };

    _renderListItem(item){
      console.log(item)
        return(
          <View>
            <View style={{flexDirection:'row',width:'100%',backgroundColor:'red'}}>
            <Text>{item.id}</Text>
            <Text>{item.nombre}</Text>
            </View>
          </View>
          )
      }

  render() {
    return (
      <View style={styles.container}>
          {/* <View style={{width: WIDTH, margin: 5}}>
            <SearchBar
                clearIcon={{ color: 'gray', size: 30 }}
                searchIcon={{
                size: 60,
                color: 'black',
                }}
                inputStyle={{
                backgroundColor: 'white',
                color: 'black',
                }}
                onChangeText={(text) => this.SearchFilterFunction(text)}
                containerStyle={{
                backgroundColor: 'white',
                borderWidth: 0,
                borderTopWidth: 0,
                borderBottomWidth: 0, 
                borderRadius: 30,
                borderColor: '#8CA853'
                }}
                placeholder='Buscar...' />
          </View> */}
          {/* <FlatList
          data={this.state.productos}
          renderItem={({item}) => <Text style={styles.item}>{item.id}</Text>}
          keyExtractor={(x, i) => i} 
        /> */}
        <FlatList
          data={this.state.productos}
          renderItem={({item, separators}) => (  
            
                <Text style={styles.texto}>{item.titulo} - {item.autor}</Text>
          )}
          keyExtractor={item => item.id.toString()}
        />
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