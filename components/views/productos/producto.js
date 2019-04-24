import React from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Constants } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SearchBar, ListItem } from 'react-native-elements';
import SingleCardView from 'react-native-simple-card';

import URL from '../../config';
import api from '../../services/fetchProductos';
import { ScrollView } from 'react-native-gesture-handler';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BARRATOP = Constants.statusBarHeight;

export default class Productos extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        productos: false,      
        error: null,
        }
     
    
      }

    
    componentDidMount() {
    
        this.getProductos();
      
    }

    componentWillMount() {

        console.log("View Productos")
    
    }

  getProductos = async () =>{
      console.log("Get Productos")
      const requestProductos = new Request("https://precios.mcypcorrientes.gob.ar/api/producto",
                { method: 'GET'});
    
    
            fetch(requestProductos)
                .then(response => {
                    if (response.status === 200) {
    
                        productos = JSON.parse(response._bodyText);
                        this.setState({ productos: productos.data });
                        

                    }
                    else {
                        console.log("ERROR EN NOTIFICACIONES")
                        console.log(response.status);
    
                    }
                })
    }

    viewProductoListado = () =>{
      let botones = []
      let prod = this.state.productos
      // console.log(this.state.productos)
      for (let index = 0; index < prod.length; index++) {
          botones.push(
            <TouchableOpacity>

              <Text key={"producto_" + index} styles={{ fontSize: 24, color: "green" }}> {prod[index].nombre}</Text>
            </TouchableOpacity>
             
          )
      }
      return <View style={styles.view}>
          <Text>Seleccionar Producto</Text>
         
              {botones}
          
      </View>
}

    // SearchFilterFunction = text => {    
    //     const newData = this.arrayholder.filter(item => {      
    //       const itemData = `${item.marca_producto_id}`;
    //        const textData = text.toUpperCase();
    //        return itemData.indexOf(textData) > -1;    
    //     });    
    //     this.setState({ data: newData });  
    // };

    // _renderListItem(item){
    //   console.log(item)
    //     return(
    //       <View>
    //         <View style={{flexDirection:'row',width:'100%',backgroundColor:'red'}}>
    //         <Text>{item.id}</Text>
    //         <Text>{item.nombre}</Text>
    //         </View>
    //       </View>
    //       )
    //   }

  render() {
    return (
     
      <View style={styles.container}>
        {this.state.productos && this.viewProductoListado() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: BARRATOP,
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