import React from 'react';
import { StyleSheet, Text, View, Dimensions, Keyboard, Alert, TouchableOpacity } from 'react-native';
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
import URL from '../../config';
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
          'Roboto_bold': require("native-base/Fonts/Roboto_bold.ttf")
      });

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
        this.setState({ search: ""});
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

    comprobarVacio = (cont) => {
      if(cont == 0){
        return (
          <Card key={"vacio"}>
            <CardItem bordered  style={styles.listItem}>
              <Left style={{flex: 2}}>
                <Icon name="ban" type="FontAwesome" style={{fontSize: 45, color: 'gray'}}/>
              </Left>
              <Body style={{flex: 8, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.textoProdVacio}>Categoría sin promociones</Text>
              </Body>
            </CardItem>
          </Card>
        );
      }
    }

    _render = () => {
        return (
            <Container style={styles.containerCard}>
            <HeaderCustom/>
            <Header searchBar transparent style={styles.barraBusqueda}>
              <Body style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingVertical: 8}}>
                <Item style={styles.searchBar}>
                    {/* <Input placeholder="Buscar Producto" onChangeText={(text) => this.SearchFilterFunction(text)}/> */}
                    <Input placeholder="Buscar producto" style={{ marginLeft: 10 }}
                            onChangeText={(text) => this.setState({search:text})}
                            // onKeyPress={this.handleKeyDown}
                            keyboardType="default"
                            returnKeyType="next"
                            onSubmitEditing={()=> this._handlePress() }
                            ref={this.searchInput}/>
                    <Button iconRight primary style={styles.btnNative} onPress={() => this._handlePress()}>
                        <Icon active name='search' type="FontAwesome" style={{fontSize: SIZE, color: 'gray'}}/>
                    </Button>
                </Item>
              </Body>
            </Header>

            <Content style={styles.containerBody}>
            <List style={styles.listCat}>
              {this.state.categorias.map((cat, i) => {
                let cont = 0;
                return(
                <Content style={styles.containerPromos} key={i}>
                  <Text style={styles.tituloCat}>{this.Capitalize(cat.nombre)}</Text>
                  <Content horizontal={true} contentContainerStyle={styles.contentContainer}>
                  
                    <ListItem key={"categoria_" + cat.categoria_id} style={{flexDirection: 'column', borderBottomColor: 'transparent', marginLeft: 6, marginTop: -12 }}>
                    
                      <List thumbnail style={styles.list}>
                        {this.state.promociones.map((data, j) => {
                              if (cat.nombre === data.categoria) {
                                cont++;
                                return (
                                  <Card key={"promocion_" + j + i} >
                                  <CardItem button bordered style={styles.listItem} onPress={() => this.props.navigation.push('DetalleHome', {mpid: data.marca_producto_id})}>
                                    
                                    <Left style={{flex: 3, marginLeft: 0}}>
                                      {data.imagen !== null ? <Thumbnail square large source={{uri: URL + data.imagen}} /> : <Icon name="ban" type="FontAwesome" style={{fontSize: 40, color: 'gray'}}/>}
                                    </Left>
                                    <Body style={{flex: 7, flexDirection: 'column'}}>
                                      {/* <Item style={{flex: 8, flexDirection: 'column', borderBottomColor: 'transparent', justifyContent: 'flex-start', alignItems: 'flex-start'}}> */}
                                        <Text style={styles.textoProd}>{data.producto} {data.peso} {data.marca}</Text>
                                        <Text style={styles.textoProdSuper}>{data.supermercado}</Text>
                                      {/* </Item> */}
                                      <Item style={styles.listItemPrecio}>
                                        <Item style={styles.listItemPromo}>
                                          <Text style={{color: "#FFF", paddingHorizontal: 7, paddingVertical: 0, fontSize: 14, fontWeight: '500', textAlign: 'center'}}
                                          onPress={() =>
                                            Toast.show({
                                              text: <Text>{(data.fecha_promo_final != null) ? (data.promocion + " " + data.descripcion_promo + " - Válido hasta el " + data.fecha_promo_final.substring(0, data.fecha_promo_final.length -9)) : (data.promocion + " " + data.descripcion_promo + " - Válido hasta el ")}</Text>,
                                              duration: 7000,
                                              buttonText: "Ok",
                                              type: "success"
                                            })}
                                            >Promo</Text>
                                        </Item>
                                        
                                        <Text style={styles.textoPrecioLista}>
                                            ${parseFloat(data.precio_lista).toFixed(2)}
                                        </Text>
                                        <Text style={styles.textoPrecioPromo}>
                                            ${parseFloat(data.precio_promocion).toFixed(2)}
                                        </Text>
                                      </Item>
                                    </Body>
                                  </CardItem>
                                  </Card>
                                );
                              }
                            }
                        )}
                        {this.comprobarVacio(cont)}
                      </List>
                    </ListItem>
                  </Content>
                </Content>
                );
              })}
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
  btnNative: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowColor: null,
    shadowOffset: null,
    shadowRadius: null,
    shadowOpacity: null,
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
    marginBottom: 10,
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
    fontFamily: 'Roboto_medium',
    fontSize: 16,
    color: '#434343',
    marginLeft: 12,
  },
  textoProd: {
    //flex: 5,
    fontSize: 14,
    color: '#434343',
    fontFamily: 'Roboto_bold',
    textAlign: 'left',
    marginBottom: 0
  },
  textoProdSuper: {
    flex: 2,
    fontSize: 14,
    color: '#959595',
    fontFamily: 'Roboto_bold',
    textAlign: 'left',
    marginTop: 0
  },
  textoProdVacio: {
    fontSize: 16,
    color: 'gray',
    fontFamily: 'Roboto_medium',
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
    marginRight: 6,
    fontFamily: 'Roboto',
  },
  textoPrecioPromo: {
    color: '#434343',
    textAlign: 'right',
    fontSize: 15,
    fontFamily: 'Roboto_bold',
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
    height: HEIGHT / 6,
    borderRadius: 7,
    shadowColor: '#000000',
  },
  listItemVacio: {
    marginRight: 4,
    width: WIDTH - 70,
    height: HEIGHT / 6,
    borderRadius: 7,
    shadowColor: '#000000',
    alignContent: 'center', 
    justifyContent: 'center'
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
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    borderBottomColor: 'transparent',
    marginLeft: 50,
    marginRight: 8,
    textAlign: 'right'
  },
  listItemPromo: {
    borderColor: 'transparent',
    backgroundColor: '#e34234',
    marginRight: 10,
    paddingHorizontal: 0,
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