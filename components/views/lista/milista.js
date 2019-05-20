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

import HeaderCustom from '../fijos/header';
import api from '../../services/fetchProductos';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BARRATOP = Constants.statusBarHeight;

export default class MiLista extends React.Component {

    constructor(props) {
        super(props);
        this.props.navigation.addListener('didFocus', () => {
          this.verificarLista();
        });

        this.state = {
        loading: true,
        listaVacia: true,
        enlista: false, //piñata
        showToast: false,
        productos: [],
        flag: 0
        }

        this.listaArray = [];
    }

    async componentDidMount() {

      
      this.verificarLista(); //piñata
      
        
        const productos = await api.fetchListarProductosSupermercados();
        await Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });

          
        this.setState({ productos: productos.data, loading: false, flag: 10 });

        
    }

    async componentWillMount() {

    }

    async componentWillUnmount() {

    }

    verificarLista = async () => {
      //piñata
      var milista = [];
      const lista = await AsyncStorage.getItem('lista');

      if(lista == null) {
        console.log(" milista null");
        
        this.setState({ listaVacia: true, flag: 1 });
      } else {
        milista = JSON.parse(lista);
        this.listaArray = milista;
        this.setState({ enlista: false, flag: 8 }); 
      }
    }

    _eliminarLista = async (id) => {
      //piñata
      var milista = [];
      const lista = await AsyncStorage.getItem('lista');
      milista = JSON.parse(lista);

      for (let index = 0; index < milista.length; index++) {

        if(milista[index].marca_producto_id == id) {
          milista.splice(index, 1);
          this.listaArray = milista;
          this.setState({ enlista: false, flag: 3 });
          Toast.show({
            text: "¡Producto eliminado de Mi Lista!",
            textStyle: { textAlign: "center", color: '#FFF' },
            duration: 2000,
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

      lista = await AsyncStorage.getItem('lista');
      milista = JSON.parse(lista);
      this.listaArray = milista;
      this.setState({ enlista: false, flag: 13 });
      
    }

    _eliminarTodos = async () => {
      //piñata
      var milista = [];
      const lista = await AsyncStorage.getItem('lista');
      milista = JSON.parse(lista);

      for (let index = 0; index = milista.length; index++) {

          milista.splice(index, 1);
          this.listaArray = milista;
          this.setState({ enlista: false, flag: 3 });
      }

      await AsyncStorage.setItem('lista', JSON.stringify(milista) )
            .then( ()=>{
              console.log("se almaceno lista")
            } )
            .catch( ()=>{
              console.log("error al guardar lista")
      } );

      lista = await AsyncStorage.getItem('lista');
      milista = JSON.parse(lista);
      this.listaArray = milista;
      this.setState({ enlista: false, flag: 13 });
      Toast.show({
        text: "¡Productos eliminados de Mi Lista!",
        textStyle: { textAlign: "center", color: '#FFF' },
        duration: 2000,
        type: "success"
      });
    }

    viewProductosListado = () => {
      let botones = [];
      let prod = this.state.productos;
      let list = this.listaArray;
      let count = 0;
      console.log("producto" + prod);
      console.log("lenght array " + list.length);
      console.log("lenght prod " + prod.length);
      //let list = this.listaArray;
      //console.log("producto" + this.listaArray);
      for (let ind = 0; ind < list.length; ind++) {
      
        console.log("for lista " + list[ind].marca_producto_id);
        let count2 = 0;
        for (let index = 0; index < prod.length; index++) {  
          if(list[ind].marca_producto_id === prod[index].marca_producto_id && count2 === 0) {
            console.log("count2 " + count2 + " ind " + ind);
            count++;
            count2 = count2 + 1;
            
            let nombreprod = prod[index].producto;
            let mpid = prod[index].marca_producto_id;
            console.log("producto" + nombreprod + " " + mpid);
            botones.push(
              <CardItem button bordered 
                  key={"categoria_" + index}
                >
                  <Left style={{ flex: 2 }}>
                  <Icon
                      active
                      name="store"
                      type="MaterialCommunityIcons"
                      style={{ color: "#78BE20" }}
                    />
                  </Left>
                  {/* <Body style={styles.bodyCard} onPress={() => this.props.navigation.push('DetalleLista', {mpid: mpid})}> */}
                  <Body style={styles.bodyCard} onPress={() => Alert.alert('Ir a Detalle Lista', {text: 'OK', onPress: () => console.log('OK Pressed')}) }>
                      <Text style={styles.texto}>{prod[index].producto} {prod[index].marca} {prod[index].peso}</Text>
                  </Body>
                  <Right style={{ flex: 2 }}>
                    <Icon name="trash-can-outline" type="MaterialCommunityIcons" style={{ color: "gray"}} onPress={() => this._eliminarLista(prod[index].marca_producto_id)}/>
                  </Right>
              </CardItem>
            )
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
              {/* <Body style={styles.bodyCard} onPress={() => this.props.navigation.push('DetalleLista', {mpid: mpid})}> */}
              <Body style={styles.bodyCard} >
                  <Text style={styles.textovacio}>Lista vacia...</Text>
              </Body>
          </CardItem>
        )
      }
        return <Container style={styles.containerCard}>
                <HeaderCustom/>
                <Header transparent>
                <Item style={{borderBottomColor: 'transparent', margin: 8, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  <Button transparent style={styles.botonMilistaRem}
                        onPress={() => this._eliminarTodos()}>
                      <Icon name="trash-can-outline" type="MaterialCommunityIcons" style={{ color: "gray"}}/>
                      <Text style={styles.textoMilistaRem}>VACIAR MI LISTA</Text>
                  </Button>
                </Item>
                </Header>
                <Content padder>
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
    fontSize: 20,
    fontWeight: 'bold', 
  },
  textovacio: {
    color: 'gray',
    fontSize: 24,
    fontWeight: 'bold', 
  },
  bodyCard: {
    flex: 8,
    flexDirection: 'column',
  },
  botonMilistaRem: {
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
    alignItems: 'center',
    marginLeft: 8
  },
  textoMilistaRem: {
    color: 'gray',
    fontWeight: '400',
    fontSize: 14,
  },
});