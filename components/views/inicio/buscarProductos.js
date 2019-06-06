import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
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
    Spinner
  } from "native-base";

import api from '../../services/fetchProductos';
import URL from '../../config';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const SIZE = WIDTH * 0.07;
const BARRATOP = Constants.statusBarHeight;

export default class buscarProductos extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        productos: [],
        filterProductos: [],
        cat: null,     
        error: null,
        loading: true
        }

        this.searchInput = React.createRef();
        this.arrayholder = [];
      }

    async componentDidMount() {

        const productos = await api.fetchListarProductosSupermercados();
        
        await Font.loadAsync({
          'Roboto': require("native-base/Fonts/Roboto.ttf"),
          'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
          'Roboto_bold': require("native-base/Fonts/Roboto_bold.ttf")
        });

        this.arrayholder = productos.data;
        this.setState({ loading: false });

        this.filtrarProductos(this.props.navigation.state.params.prod);
        
    }

    async componentWillUnmount() {

    }

    //Filtro al cargar el componente con el termino que se paso del home
    filtrarProductos = (prod) => {
      const newData = this.arrayholder.filter(item => {      
        const itemData = `${item.producto.toUpperCase()} ${item.marca.toUpperCase()}`;
         const textData = prod.toUpperCase();
         return itemData.indexOf(textData) > -1;    
      });
      //console.log(newData);
      this.setState({ productos: newData });
  }

  //Funcion para filtrar busqueda por nombre de producto y marca
    SearchFilterFunction = (text) => {    
      const newData = this.arrayholder.filter(item => {      
        const itemData = `${item.producto.toUpperCase()} ${item.marca.toUpperCase()}`;
         const textData = text.toUpperCase();
         return itemData.indexOf(textData) > -1;    
      });    
      this.setState({ productos: newData });  
  };

  _onPress = (mpid) => {
    const text = "";
    this.searchInput.current._root.clear();
    this.props.navigation.navigate('DetalleHome', {mpid: mpid});
  };

    viewProductosListado = () => {
      let botones = [];
      let prod = this.state.productos;

      let cont = 0;

      var prod1 = [...prod];
      prod1.sort((a,b) => (a.marca_producto_id - b.marca_producto_id || (a.precio_promocion === null) - (b.precio_promocion === null) || a.precio_promocion - b.precio_promocion || a.precio_lista - b.precio_lista));
      
      if(prod1.length == 0) {
        botones.push(
          <CardItem button bordered 
              key={"categoria_" + 1}
            >
              <Left style={{ flex: 2 }}>
                <Icon name="ban" type="FontAwesome" style={{fontSize: 60, color: 'gray'}}/>
              </Left>
              <Body style={styles.bodyCardVacio} >
                  <Text style={styles.textoVacio}>Producto no encontrado</Text>
              </Body>
          </CardItem>
          )
      } else {
        for (let index = 0; index < prod1.length; index++) {

          if(cont !== prod1[index].marca_producto_id) {
            cont = prod1[index].marca_producto_id;
            let mpid = prod1[index].marca_producto_id;
            botones.push(
              <CardItem button bordered onPress={() => this._onPress(mpid)}
                  key={"categoria_" + index}
                >
                  <Left style={{ flex: 2 }}>
                  {prod1[index].imagen !== null ? <Thumbnail square source={{uri: URL + prod1[index].imagen}} /> : <Icon name="ban" type="FontAwesome" style={{fontSize: 40, color: 'gray'}}/>}
                  </Left>
                  <Body style={styles.bodyCard}>
                      <Text style={styles.texto}>{prod1[index].producto.toUpperCase()} {prod1[index].peso.toUpperCase()} {prod1[index].marca.toUpperCase()}</Text>
                      {prod1[index].precio_promocion === null ? <Text note>Desde ${parseFloat(prod1[index].precio_lista).toFixed(2)}</Text> : <Text note>Desde ${parseFloat(prod1[index].precio_promocion).toFixed(2)}</Text>}
                  </Body>
                  <Right style={{ flex: 1 }}>
                    <Icon 
                      name="chevron-right"
                      type="FontAwesome"
                      />
                  </Right>
                </CardItem>
              )
            }
          }
        }
        return <Container style={styles.containerCard}>
                <Header style={styles.header}>
                  <Body style={styles.bodyheader}>
                    <Text style={styles.textoheader}>Producto</Text>
                  </Body>
                </Header>
                <Header searchBar transparent >
                <Body style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingVertical: 8}}>
                  <Item style={styles.searchBar}>
                    <Input placeholder="Buscar producto" style={{ marginLeft: 10 }}
                      onChangeText={(text) => this.SearchFilterFunction(text)}
                      onKeyPress={this.handleKeyDown}
                      ref={this.searchInput}/>
                    <Button iconRight style={styles.btnNative} primary>
                        <Icon active name='search' type="FontAwesome" style={{fontSize: SIZE, color: 'gray'}}/>
                    </Button>
                  </Item>
                  </Body>
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
    }
    return (
      <View style={styles.container}>
        {this.state.productos && this.viewProductosListado() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: BARRATOP,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerCard: {
    backgroundColor: "#F9F9F9",
    width: WIDTH,
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
  mb: {
    marginBottom: 15
  },
  card: {
      flex: 1,
  },
  btnCard: {
      flex: 1,
  },
  bodyCard: {
    flex: 7,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  bodyCardVacio: {
    flex: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontFamily: 'Roboto_medium',
    color: '#434343',
    fontSize: 14,
    textAlign: 'auto'
  },
  textoVacio: {
    fontFamily: 'Roboto_bold',
    color: 'gray',
    fontSize: 20,
  },
  btnNative: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowColor: null,
    shadowOffset: null,
    shadowRadius: null,
    shadowOpacity: null,
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
  }
});