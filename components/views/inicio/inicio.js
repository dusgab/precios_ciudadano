import React from 'react';
import { StyleSheet, Text, View, Dimensions, Keyboard, Alert } from 'react-native';
import { Constants, Font } from 'expo';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Card,
    CardItem,
    Item,
    Input,
    Thumbnail,
    Left,
    Right,
    Body,
    Icon,
    List,
    ListItem,
    Spinner,
    Toast
  } from "native-base";

import api from '../../services/fetchProductos';
import HeaderCustom from '../fijos/header';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const SIZE = WIDTH * 0.07;
const icono = require('../../../assets/coca15.jpg');
const icono1 = require('../../../assets/galletita.jpg');
const icono2 = require('../../../assets/carne.png');

export default class Inicio extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        promociones: [],
        categorias: [],
        filterProductos: [],
        search: null,
        loading: true,
        showToast: false
        }

        this.searchInput = React.createRef();
        this.arrayholder = [];
      }

    async componentDidMount() {

      const categorias = await api.fetchCategoria();
      const promociones = await api.fetchPromociones();

      await Font.loadAsync({
        'Roboto': require("native-base/Fonts/Roboto.ttf"),
        'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
        'amazon': require("../../../assets/amazon.ttf")
      });

      // this.arrayholder = productos.data;
      // console.log(this.arrayholder);
       this.setState({ promociones: promociones.data, categorias: categorias.data, loading: false });
      
    }

    _handlePress = () => {
      this.searchInput.current._root.clear();
      Keyboard.dismiss()
      const text = this.state.search;
      if(text === null || text === "") {
        Alert.alert(
          'Precios Correntinos',
          'Escriba un producto a buscar. Ej. fideos',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
      } else {
        this.props.navigation.navigate('Buscar', {prod: text});
      }
      
    };

    handleKeyDown = (e) => {
      console.log("handle key" + e.nativeEvent.key);
      if(e.nativeEvent.key === "Enter") {
          this._handlePress();
      }
    }

    Capitalize(str){
      return str.charAt(0).toUpperCase() + str.slice(1);
      }

    _render = () => {
        return (
            <Container style={styles.containerCard}>
            <HeaderCustom/>
            <Header searchBar transparent style={styles.barraBusqueda}>
              <Body style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingVertical: 8}}>
                <Item style={styles.searchBar}>
                    {/* <Input placeholder="Buscar Producto" onChangeText={(text) => this.SearchFilterFunction(text)}/> */}
                    <Input placeholder="Buscar producto" 
                            onChangeText={(text) => this.setState({search:text})}
                            // onKeyPress={this.handleKeyDown}
                            keyboardType="default"
                            returnKeyType="next"
                            onSubmitEditing={()=> this._handlePress() }
                            ref={this.searchInput}/>
                    <Button iconRight transparent primary onPress={() => this._handlePress()}>
                        <Icon active name='search' type="FontAwesome" style={{fontSize: SIZE, color: 'gray'}}/>
                    </Button>
                </Item>
              </Body>
            </Header>

            <Content style={styles.containerBody}>
            <List style={styles.listCat}>
              {this.state.categorias.map((cat, i) => (
                <Content style={styles.containerPromos} key={i}>
                  <Text style={styles.tituloCat}>{this.Capitalize(cat.nombre)}</Text>
                  <Content horizontal={true} contentContainerStyle={styles.contentContainer}>
                  
                    <ListItem key={"categoria_" + cat.categoria_id} style={{flexDirection: 'column', borderBottomColor: 'transparent', marginLeft: 6}}>
                    
                      <List thumbnail style={styles.list}>
                        {this.state.promociones.map((data, j) => {
                            if (data.precio_promocion != null) {
                              if (cat.nombre === data.categoria) {
                                return (
                                  <Card key={"promocion_" + j + i}>
                                  <CardItem button bordered style={styles.listItem} 
                                  onPress={() => this.props.navigation.push('DetalleHome', {id: data.producto, mpid: data.marca_producto_id, flag: 'Inicio'})}
                                  >
                                    <Left style={{flex: 2}}>
                                      <Thumbnail square size={40} source={icono1} />
                                    </Left>
                                    <Body style={{flex: 8, flexDirection: 'column'}}>
                                      <Text style={styles.textoProd}>{data.producto} {data.peso} {data.marca} - {data.supermercado}</Text>
                                      {/* <Item footer style={styles.listItemPrecio}> */}
                                    <Item style={styles.listItemPrecio}>
                                      <Item style={styles.listItemPromo}>
                                          <Text style={{color: "#FFF", paddingHorizontal: 7, paddingVertical: 3, fontSize: 14, fontWeight: '500', textAlign: 'center'}}
                                          onPress={() =>
                                            Toast.show({
                                              text: <Text>{(data.fecha_promo_final != null) ? (data.promocion + " " + data.descripcion_promo + " - Válido hasta el " + data.fecha_promo_final.substring(0, data.fecha_promo_final.length -9)) : (data.promocion + " " + data.descripcion_promo + " - Válido hasta el ")}</Text>,
                                              style: {
                                                backgroundColor: "#78BE20",
                                                color: '#FFF'
                                               },
                                              duration: 7000,
                                              buttonText: "Ok",
                                              type: "success"
                                            })}>Promo</Text>
                                        </Item>
                                        
                                        <Text style={styles.textoPrecioLista}>
                                            $ {data.precio_lista}
                                        </Text>
                                        <Text  style={styles.textoPrecioPromo}>
                                            $ {data.precio_promocion}
                                        </Text>
                                      </Item>
                                    </Body>
                                    
                                  </CardItem>
                                  </Card>
                                );
                              }
                            } else {
                              return (
                                <ListItem key={"promocion_" + j + i} style={styles.listItem}>
                                  <Left style={{flex: 2}}>
                                    <Icon name="ban" type="FontAwesome" style={{fontSize: 60, color: '#838181'}}/>
                                  </Left>
                                  <Body style={{flex: 8, flexDirection: 'column'}}>
                                    <Text style={styles.textoProd}>Categoría sin Promociones</Text>
                                  </Body>
                                </ListItem> 
                              );
                            }
                        })
                        }
                      </List>
                </ListItem>
                </Content>
                </Content>
              ))}
            </List>
            </Content>
        </Container>
        );
    }

  render() {
      if (this.state.loading) {
        return (
          <Container style={styles.container}>
            <Spinner color='#78BE20' />
          </Container>
        );
      } else {
      return (
        <View style={styles.container}>
            {this._render() }
        </View>
      );
      }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 3
  },
  containerCard: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    width: WIDTH,
  },
  containerBody: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  contentContainer: {
    justifyContent: 'flex-start',
    alignContent: 'flex-start'
  },
  containerPromos: {
    flexDirection: 'column',
  },  
  titulo: {
    fontSize: 22,
    color: '#434343',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  tituloPromo: {
    flex: 7,
    fontSize: 20,
    color: '#434343',
    marginBottom: 8,
    marginLeft: 12,
    fontWeight: 'bold'
  },
  tituloCat: {
    fontSize: 18,
    color: '#434343',
    fontWeight: 'bold',
    marginLeft: 12,
  },
  textoProd: {
    flex: 7,
    fontSize: 16,
    color: '#434343',
    fontWeight: '500',
    textAlign: 'left'
  },
  subtitulo: {
    fontSize: 20,
    color: 'gray'
  },
  textoPrecioLista: {
    textDecorationLine: 'line-through',
    color: 'gray',
    textAlign: 'right',
    fontSize: 15,
    marginRight: 6
  },
  textoPrecioPromo: {
    color: '#434343',
    textAlign: 'right',
    fontSize: 15,
    fontWeight: 'bold'
  },
  barraBusqueda: {
    backgroundColor: '#F9F9F9',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 2
  },
  searchBar: {
    backgroundColor: '#FFF',
    borderStyle: 'solid',
    borderTopWidth: 2, 
    borderBottomWidth: 2, 
    borderLeftWidth: 2, 
    borderRightWidth: 2, 
    borderColor: '#78BE20',
    borderRadius: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 2
  },
  searchBarText: {
    color: 'gray',
    textAlign: 'auto'
  },
  top: {
    flex: 3,
    backgroundColor: "#78BE20",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
      flex: 2,
  },
  list: {
    flexDirection: 'row',
    borderBottomColor: 'transparent',
    marginLeft: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  listCat: {
    borderBottomColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  listItem: {
    marginRight: 4,
    width: WIDTH - 70,
    height: HEIGHT / 5.5,
    borderRadius: 7,
    shadowColor: '#000000',
  },
  listItemOld: {
    backgroundColor: '#FFF',
    marginLeft: 0,
    marginRight: 14,
    width: WIDTH - 40,
    height: HEIGHT / 5,
    marginBottom: 5,
    borderStyle: 'solid', 
    borderTopWidth: 3, 
    borderBottomWidth: 3, 
    borderLeftWidth: 3, 
    borderRightWidth: 3, 
    borderColor: 'transparent',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 1
},
  listItemPrecio: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'flex-end', 
    justifyContent: 'flex-end',
    borderBottomColor: 'transparent',
    marginLeft: 65,
    textAlign: 'right'
  },
  listItemPromo: {
    borderColor: 'transparent',
    backgroundColor: '#FF1024',
    marginRight: 10,
    paddingHorizontal: 3,
    borderRadius: 30,
  },    
  botones: {
      flexDirection: 'row',
      alignItems: 'center',
    justifyContent: 'center',
  },
  botonesTexto: {
    flex: 1,
  }
});