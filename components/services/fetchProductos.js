import URL from '../config';

export default {
    async fetchProductoSupermecado() {
        try {
            console.log("Fetch Producto Supermercado");
            let response = await fetch(URL + 'producto_supermercado');
            let responseJsonData = await response.json();
            return responseJsonData;
        }
    catch(e) {
        console.log(e)
    }

    },
    async fetchProductosSupermecados() {
        try {
            console.log("Fetch Productos Supermercados");
            let response = await fetch(URL + 'productos_supermercados');
            let responseJsonData = await response.json();
            return responseJsonData;
        }
    catch(e) {
        console.log(e)
    }

    },
    async fetchProductos() {
        try {
            console.log("Fetch Productos");
            let response = await fetch(URL + 'producto');
            let responseJsonData = await response.json();
            return responseJsonData;
        }
        catch(e) {
            console.log(e)
        }
        
        
        // const requestProductos = new Request(URL + 'producto',
        //         { method: 'GET'});
        //         console.log(requestProductos);
        // fetch(requestProductos)
        //     .then(response => {
        //         if (response.status === 200) {
                    
        //             const producto = JSON.parse(response._bodyText);
        //             //const producto = prod.data;
        //             return producto;
        //         }
        //         else {
        //             console.log("ERROR EN PRODUCTO")
        //             console.log(response.status);
        //         }
        //     })
    },
    async fetchProductoBuscar(prod) {
        try {
            console.log("Fetch Producto Buscar" + prod);
            let response = await fetch(URL + 'producto_buscar/' + prod);
            let responseJsonData = await response.json();
            return responseJsonData;
        }
        catch(e) {
            console.log(e)
        }
    },
    async fetchCategoria() {
        try {
            console.log("Fetch Categorias");
            let response = await fetch(URL + 'categoria');
            let responseJsonData = await response.json();
            return responseJsonData;
        }
        catch(e) {
            console.log(e)
        }

    },
}