import React from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage, Alert, Actions } from 'react-native';
import { Constants, Font } from 'expo';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    Card,
    CardItem,
    Text,
    Item,
    Input,
    Thumbnail,
    Left,
    Right,
    Body, 
    Spinner,
    Toast,
  } from "native-base";

import api from '../../services/fetchProductos';
import URL from '../../config';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BARRATOP = Constants.statusBarHeight;

export default class MiLista extends React.Component {

    constructor(props) {
        super(props);
        
        this.props.navigation.addListener('didFocus', () => {
          if ( this.state.isMounted ) {
            this.verificarLista();
          }
        });

        this.state = {
        loading: true,
        listaVacia: true,
        enlista: false,
        showToast: false,
        productos: [],
        isMounted: false,
        flag: 0
        }

        this.listaArray = [];
    }

    async componentDidMount() {

      this.verificarLista();
        
        const productos = await api.fetchListarProductosSupermercados();

        await Font.loadAsync({
          'Roboto': require("native-base/Fonts/Roboto.ttf"),
          'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
          'Roboto_bold': require("native-base/Fonts/Roboto_bold.ttf")
        });

        this._alertInfo();

        this.setState({ productos: productos.data, loading: false, flag: 10, isMounted: true });

    }

    _alertInfo = () => {
      Alert.alert(
        'Precios Correntinos',
        'Compare su lista de productos favoritos para encontrar los mejores precios!',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      );
    }

    verificarLista = async () => {
      var milista = [];
      const lista = await AsyncStorage.getItem('lista');
      if(lista == null || lista.length == 0) {
        this.setState({ listaVacia: true, flag: 1 });
      } else {
        milista = JSON.parse(lista);
        this.listaArray = milista;
        this.setState({ enlista: false, listaVacia: false, flag: 8 }); 
      }
  }

    _eliminarLista = async (id) => {
      var milista = [];
      const lista = await AsyncStorage.getItem('lista');
      milista = JSON.parse(lista);

      for (let index = 0; index < milista.length; index++) {

        if(milista[index].marca_producto_id == id) {
          milista.splice(index, 1);
          this.listaArray = milista;
          if(this.listaArray.length == 0 || this.listaArray == null) {
            this.setState({ listaVacia: true, flag: 139 });  
          }
          this.setState({ flag: 3 });
          Toast.show({
            text: "¡Producto eliminado de Mi Lista!",
            textStyle: { textAlign: "center", color: '#FFF' },
            duration: 1500,
            type: "success"
          });
        }
      }

      await AsyncStorage.setItem('lista', JSON.stringify(milista) )
            .then( ()=>{
              console.log("se almaceno lista")
            } )
            .catch( ()=>{
              console.log("error al guardar lista")
      } );

      const lista1 = await AsyncStorage.getItem('lista');
      milista = JSON.parse(lista1);
      this.listaArray = milista;
      if(this.listaArray.length == 0 || this.listaArray == null) {
        this.setState({ listaVacia: true, flag: 135 });  
      }
      this.setState({ flag: 13 });
      
    }

    _eliminarTodos = async () => {
      console.log("eliminar todos ");
      await AsyncStorage.clear();
    
      this.listaArray = null;
      this.setState({ listaVacia: true, flag: 133 });

      Toast.show({
        text: "¡Productos eliminados de Mi Lista!",
        textStyle: { textAlign: "center", color: '#FFF' },
        duration: 1500,
        type: "success"
      });
    }

    viewProductosListado = () => {
      let botones = [];
      let prod = this.state.productos;
      let count = 0;

      if (this.listaArray != null) {
        for (let ind = 0; ind < this.listaArray.length; ind++) {
        
          let count2 = 0;
          for (let index = 0; index < prod.length; index++) {  
            if(this.listaArray[ind].marca_producto_id === prod[index].marca_producto_id && count2 === 0) {
              count++;
              count2 = count2 + 1;
              
              botones.push(
                <CardItem button bordered
                    key={"categoria_" + index + ind + count2}
                    style={{ flex: 1, marginTop: 2 }}
                  >
                    <Left style={{ flex: 2 }}>
                    {prod[index].imagen !== null ? <Thumbnail square small source={{uri: URL + prod[index].imagen}} /> : <Icon name="ban" type="FontAwesome" style={{fontSize: 30, color: 'gray'}}/>}
                    </Left>
                    <Body style={styles.bodyCard} >
                        <Text style={styles.texto}>{prod[index].producto} {prod[index].marca} {prod[index].peso}</Text>
                    </Body>
                    <Right style={{ flex: 2 }}>
                      <Icon name="trash-can-outline" type="MaterialCommunityIcons" style={{ color: "gray", fontSize: 28 }} onPress={() => this._eliminarLista(prod[index].marca_producto_id)}/>
                    </Right>
                </CardItem>
              )
            }
          }
        }
      }

      if(count == 0) {
        botones.push(
          <CardItem button bordered 
              key={"categoria_" + 1}
            >
              <Left style={{ flex: 2 }}>
                <Icon name="ban" type="FontAwesome" style={{fontSize: 60, color: 'gray'}}/>
              </Left>
              <Body style={styles.bodyCardVacio} >
                  <Text style={styles.textovacio}>Lista vacia...</Text>
              </Body>
          </CardItem>
        )
      }

      return <Container style={styles.containerCard}>
              <Header style={styles.header}>
                <Body style={styles.bodyheader}>
                  <Text style={styles.textoheader}>Mi Lista</Text>
                </Body>
              </Header>
              <Header transparent style={styles.headerBotones}>
                {this.state.listaVacia ?
                <Item style={{borderBottomColor: 'transparent', margin: 0, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <Button transparent style={styles.botonMilistaRemV}>
                      <Text style={styles.textoMilistaRemL}>VACIAR MI LISTA</Text>
                  </Button>
                  <Button transparent style={styles.botonMilistaCompV}>
                      <Text style={styles.textoMilistaRem}>COMPARAR</Text>
                  </Button>
                </Item>
                :
                <Item style={{borderBottomColor: 'transparent', margin: 0, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <Button transparent style={styles.botonMilistaRem}
                        onPress={() => this._eliminarTodos()}>
                      {/* <Icon name="trash-can-outline" type="MaterialCommunityIcons" style={{ color: "gray"}}/> */}
                      <Text style={styles.textoMilistaRemL}>VACIAR MI LISTA</Text>
                  </Button>
                  <Button transparent style={styles.botonMilistaComp}
                        onPress={() => this.props.navigation.navigate('CompararLista')}>
                      <Text style={styles.textoMilistaRem}>COMPARAR</Text>
                  </Button>
                </Item>
                }
              </Header>
              <Content padder>
                <Item style={{borderBottomColor: 'transparent', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={styles.titulo}>¡Ahorrá Más!</Text>
                  <Text style={styles.textotitulo}>Compará el precio de tu lista en cada supermercado. Algunos productos pueden no estar disponibles.</Text>
                </Item>
                <Card style={styles.mb}>
                  {botones}
                </Card>
              </Content>
            </Container>
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
          {this.state.flag && this.viewProductosListado()}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: BARRATOP,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    width: WIDTH,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFF",
    width: WIDTH,
    textAlign: 'center'
  },
  containerCard: {
    backgroundColor: "#F9F9F9",
    width: WIDTH,
    flexDirection: 'column'
  },
  header: {
    backgroundColor: '#fff',
  },
  bodyheader: {
    flex: 1,
    width: WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoheader: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Roboto_medium',
    color: '#434343'
  },
  headerBotones: {
    width: WIDTH,
    flexDirection: 'column'
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 150
  },
  texto: {
    color: '#434343',
    fontSize: 16,
    fontFamily: 'Roboto_medium' 
  },
  textovacio: {
    color: 'gray',
    fontSize: 24,
    fontWeight: 'bold', 
  },
  titulo: {
    color: '#434343',
    fontSize: 14,
    fontFamily: 'Roboto_medium'
  },
  textotitulo: {
    color: 'gray',
    fontSize: 12,
    fontFamily: 'Roboto',
    textAlign: 'center'
  },
  bodyCard: {
    flex: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  bodyCardVacio: {
    flex: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonMilistaRem: {
    flex: 5,
    marginRight: 2,
    borderColor: '#FF1024',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  botonMilistaRemV: {
    flex: 5,
    marginRight: 2,
    borderColor: 'gray',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  botonMilistaComp: {
    flex: 5,
    marginLeft: 2,
    borderColor: '#78BE20',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  botonMilistaCompV: {
    flex: 5,
    marginLeft: 2,
    borderColor: 'gray',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoMilistaRem: {
    color: 'gray',
    fontWeight: '400',
    fontSize: 14,
  },
  textoMilistaRemL: {
    color: 'gray',
    fontWeight: '400',
    fontSize: 14,
  },
});