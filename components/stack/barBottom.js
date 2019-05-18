import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Dimensions } from 'react-native';
import { Icon, Thumbnail } from "native-base";

import Inicio from '../views/inicio/inicio';
import Detalle from '../views/productos/detalle_producto';
import DetalleHome from '../views/inicio/detalle_producto_home';
import Buscar from '../views/inicio/buscarProductos';
import Productos from '../views/productos/productos';
import Categorias from '../views/productos/categorias';
import MiLista from '../views/lista/milista';
import Estadistica from '../views/estadisticas/estadisticas';
import App from '../../App';

const tintColor = "white";

const home = require('../../assets/home.png');
const prod = require('../../assets/canasta.png');
const milista = require('../../assets/mi-lista.png');
const estad = require('../../assets/estadisticas.png');

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const SIZE = WIDTH * 0.02;

const InicioStack = createStackNavigator({
  Inicio: {screen: Inicio},
  Buscar: {screen: Buscar},
  DetalleHome: {screen: DetalleHome},
},{
  headerMode: 'none',
});

const CategoriasStack = createStackNavigator({
    Categorias: {screen: Categorias},
    Productos: {screen: Productos},
    Detalle: {screen: Detalle},
  },{
    headerMode: 'none',
  });

const MiListaStack = createStackNavigator({
  Lista: {screen: MiLista}
},{
  headerMode: 'none',
});

const EstadisticaStack = createStackNavigator({
  Estadisticas: {screen: Estadistica}
},{
  headerMode: 'none',
});

const tabBarBottom = createBottomTabNavigator(
  {
    Inicio: {screen: InicioStack,
          navigationOptions: {
            tabBarIcon: ({ focused, tintColor }) => {
                if(focused === true){
                  tintColor = "#60BBE8";
                } else {
                  tintColor = "gray";
                }
                //return <Icon name="home" type="FontAwesome" style={{ color: tintColor}} />;
                return <Thumbnail square source={home}  style={{ width: 30, height: 30, resizeMode: 'contain' }} />;
          },
        },
      },
    Categorías: {screen: CategoriasStack,
        navigationOptions: {
          tabBarIcon: ({ focused, tintColor }) => {
            if(focused === true){
              tintColor = "#60BBE8";
            } else {
              tintColor = "gray";
            }
              // return <Icon name="shopping-basket" type="FontAwesome" style={{ color: tintColor}}/>;
              return <Thumbnail square  source={prod} style={{ width: 30, height: 30, resizeMode: 'contain' }}/>;
        },
      },
    },
    "Mi Lista": {screen: MiListaStack,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          if(focused === true){
            tintColor = "#60BBE8";
          } else {
            tintColor = "gray";
          }
            // return <Icon name="star" type="FontAwesome" style={{ color: tintColor}} />;
            return <Thumbnail square  source={milista} style={{ width: 30, height: 30, resizeMode: 'contain' }} />;
        },
      },
    },
    "Estadísticas": {screen: EstadisticaStack,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          if(focused === true){
            tintColor = "#60BBE8";
          } else {
            tintColor = "gray";
          }
            // return <Icon name="bar-chart" type="FontAwesome" style={{ color: tintColor}}/>;
            return <Thumbnail square source={estad} style={{ width: 30, height: 30, resizeMode: 'contain' }}/>;
        },
      },
    },
  },
  {
    initialRouteName: 'Inicio',
    lazy: 'false',
    tabBarOptions: {
      activeTintColor: '#78BE20',
      inactiveTintColor: 'gray',
      activeBackgroundColor: '#FFFFFF',
      inactiveBackgroundColor: '#FFFFFF',
      style: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#78BE20', 
        borderTopWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 4,
        elevation: 2,
      }
    }
  }
);

const AppContainer = createAppContainer(tabBarBottom);

export default AppContainer;