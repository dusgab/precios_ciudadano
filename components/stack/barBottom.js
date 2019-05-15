import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Icon } from "native-base";

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
                return <Icon name="home" type="FontAwesome" style={{ color: tintColor}} />;
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
              return <Icon name="shopping-basket" type="FontAwesome" style={{ color: tintColor}}/>;
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
            return <Icon name="star" type="FontAwesome" style={{ color: tintColor}} />;
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
            return <Icon name="bar-chart" type="FontAwesome" style={{ color: tintColor}}/>;
        },
      },
    },
  },
  {
    initialRouteName: 'Inicio',
    lazy: 'false',
    tabBarOptions: {
      activeTintColor: '#60BBE8',
      inactiveTintColor: 'gray',
      activeBackgroundColor: '#FFFFFF',
      inactiveBackgroundColor: '#FFFFFF',
      style: {
        backgroundColor: '#133101',
        borderTopColor: '#60BBE8', 
        borderTopWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 1,
        elevation: 2
      }
    }
  }
);

const AppContainer = createAppContainer(tabBarBottom);

export default AppContainer;