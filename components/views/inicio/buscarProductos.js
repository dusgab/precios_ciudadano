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
import HeaderCustom from '../fijos/header';

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
        //this.prod = [];
      }

    async componentDidMount() {
    
      console.log(this.props.navigation.state.params);
       
          const prod = await api.fetchProductoBuscar(this.props.navigation.state.params.prod);
          console.log("componente else prod" + prod.data);

        //const productos = await api.fetchProductoBuscar(this.props.navigation.state.params.prod);
        
        await Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });

        this.arrayholder = prod.data;
        this.setState({ productos: prod.data, loading: false });
        
    }

    async componentWillUnmount() {

    }

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
    this.SearchFilterFunction(text);
    this.searchInput.current._root.clear();
    
    this.props.navigation.navigate('DetalleHome', {mpid: mpid});
  };

    viewProductosListado = () => {
      let botones = [];
      let prod1 = this.state.productos;
      console.log("view prodctos" + prod1);
      
      for (let index = 0; index < prod1.length; index++) {
            // var res = prod[index].producto.substring(0, prod[index].producto.length -5);
            let id = prod1[index].producto;
            let mpid = prod1[index].marca_producto_id;
            console.log("id, mpid " + id + " " + mpid);
          botones.push(
            // <CardItem button bordered onPress={() => this.props.navigation.push('Detalle', {id: id, mpid: mpid})}
            <CardItem button bordered onPress={() => this._onPress(mpid)}
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
                <Body style={styles.bodyCard}>
                    <Text style={styles.texto}>{prod1[index].producto.toUpperCase()} {prod1[index].marca.toUpperCase()}</Text>
                    <Text note>Desde $ {prod1[index].precio_lista}</Text>
                </Body>
                <Right style={{ flex: 2 }}>
                  <Icon 
                    name="arrow-right"
                    type="FontAwesome"
                     />
                </Right>
              </CardItem>
            )
        }
        return <Container style={styles.containerCard}>
                <HeaderCustom/>
                <Header searchBar transparent >
                <Body style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingVertical: 8}}>
                  <Item style={styles.searchBar}>
                    <Input placeholder="Buscar producto" 
                      placeholderTextColor='#434343'
                      onChangeText={(text) => this.SearchFilterFunction(text)}
                      onKeyPress={this.handleKeyDown}
                      ref={this.searchInput}/>
                    <Button iconRight transparent primary>
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
        {this.state.filterProductos && this.viewProductosListado() }
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
    flex: 8,
    flexDirection: 'column',
  },
  texto: {
    color: '#434343',
    fontSize: 16,
    fontWeight: 'bold', 
    textAlign: 'auto'
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