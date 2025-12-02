//pasos para consumir api desde el frotend 

//1.construir o declarar la dirección del servidor
//el cliente o frontend se comunica con el backend o servidor 

//2. consumir la conexión hacia el API
//que llammos petición

//3. implementar la conexion 

export async function consumirApi(datos){

let url="localhost:8080/registro"
let petición={
    method:"POST",
    body:JSON.stringify(datos)
} //json

let respuesta=await fetch(url,petición)
return await respuesta.json()

}

