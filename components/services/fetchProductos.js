import URL from '../config';

export default {
    async fetchProductoSupermecado() {
        try {
            let response = await fetch(URL + 'producto_supermercado');
            let responseJsonData = await response.json();
            return responseJsonData;
        }
    catch(e) {
        console.log(e)
    }

    },
    async fetchProductos() {
        getProductos = () => {
        
       
            const requestProductos = new Request("https://precios.mcypcorrientes.gob.ar/api/producto",
                    { method: 'GET'});
        
        
                fetch(requestProductos)
                    .then(response => {
                        if (response.status === 200) {
        
                            productos = JSON.parse(response._bodyText);
                            this.setState({ productos: productos });
                            console.log(productos)
                            this.render();
                        }
                        else {
                            console.log("ERROR EN NOTIFICACIONES")
                            console.log(response.status);
        
                        }
                    })
        }
    },
    async fetchCategoria() {
        try {
            let response = await fetch(URL + 'categoria');
            let responseJsonData = await response.json();
            return responseJsonData;
        }
    catch(e) {
        console.log(e)
    }

    },
}