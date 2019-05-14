import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { Icon } from "native-base";

import Inicio from '../views/inicio/inicio';
import Detalle from '../views/productos/detalle_producto';
import Buscar from '../views/productos/buscarProductos';
import Productos from '../views/productos/productos';
import Categorias from '../views/productos/categorias';
import MiLista from '../views/lista/milista';
import Estadistica from '../views/estadisticas/estadisticas';
import App from '../../App';

const tintColor = "white";

const InicioStack = createStackNavigator({
  Inicio: {screen: Inicio},
  Buscar: {screen: Buscar},
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

// const ProductosStack = createStackNavigator({
//   Productos: {screen: Productos},
//   Detalle: {screen: Detalle},
// },{
//   headerMode: 'none',
// });

const tabBarBottom = createBottomTabNavigator(
  {
    Inicio: {screen: InicioStack,
          navigationOptions: {
            tabBarIcon: ({ focused, tintColor }) => {
                if(focused === true){
                  tintColor = "#FFFFFF";
                } else {
                  tintColor = "#78BE20";
                }
                return <Icon name="home" type="FontAwesome" style={{ color: tintColor}} />;
          },
        },
      },
    Categorías: {screen: CategoriasStack,
        navigationOptions: {
          tabBarIcon: ({ focused, tintColor }) => {
            if(focused === true){
              tintColor = "#FFFFFF";
            } else {
              tintColor = "#78BE20";
            }
              return <Icon name="shopping-basket" type="FontAwesome" style={{ color: tintColor}}/>;
        },
      },
    },
    "Mi Lista": {screen: MiListaStack,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          if(focused === true){
            tintColor = "#FFFFFF";
          } else {
            tintColor = "#78BE20";
          }
            return <Icon name="star" type="FontAwesome" style={{ color: tintColor}} />;
        },
      },
    },
    "Estadísticas": {screen: EstadisticaStack,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          if(focused === true){
            tintColor = "#FFFFFF";
          } else {
            tintColor = "#78BE20";
          }
            return <Icon name="bar-chart" type="FontAwesome" style={{ color: tintColor}}/>;
        },
      },
    },
  },
  {
    initialRouteName: 'Inicio',
    lazy: 'false',
    // navigationOptions: ({ navigation }) => ({
      
    //   tabBarIcon: () => {
    //     const { routeName } = navigation.state;
    //     let iconName;
    //     if (routeName === 'Inicio') {
    //            iconName = 'home';
    //     } else if (routeName === 'Categorias') {
    //        iconName = 'shopping-bag';
    //     }
    //     } else if (routeName === 'Karaoke') {
    //       iconName = 'videocam';
    //     } else if (routeName === 'Biblioteca') {
    //       iconName = 'library-music';
    //     } else if (routeName === 'Fiesta') {
    //       iconName = 'event-note';
    //     } else if (routeName === 'Chamiguito') {
    //       iconName = 'gamepad';
    //     }

    //     You can return any component that you like here! We usually use an
    //     icon component from react-native-vector-icons
    //     return <Icon name={iconName} color="white" type="MaterialCommunityIcons"/>;
    //   },
    // }),
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
      inactiveTintColor: '#78BE20',
      activeBackgroundColor: '#78BE20',
      inactiveBackgroundColor: '#FFFFFF',
      style: {
        backgroundColor: '#133101',
        borderTopColor: '#78BE20', 
        borderTopWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 0,
        elevation: 10
      }
    }
  }
);

const AppContainer = createAppContainer(tabBarBottom);

export default AppContainer;