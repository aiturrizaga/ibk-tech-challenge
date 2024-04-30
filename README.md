## Exchange Rate Conversor

Exchange Rate Conversor es una aplicación que permite a los usuarios registrar y autenticar para acceder a una API que proporciona información sobre tipos de cambio y conversiones de monedas.

### Ejecución

Para ejecutar los proyectos usaremos **Docker** para crear la imagen y correr el contenedor, sigue los siguientes pasos:

#### Backend

1.  `cd .\exchange-rate-api\`
2.  `docker build -t exchange-rate-api:latest .`
3.  `docker run -d -p 8080:8080 exchange-rate-api:latest`

#### Frontend

1.  `cd .\exchange-rate-webapp\`
2.  `docker build -t exchange-rate-web:latest .`
3.  `docker run -d -p 4200:80 exchange-rate-web:latest`

> [!NOTE]
> Despues de crear la imagen y ejecutar los contenedores en docker, debera ingresar a http://localhost:4200 para probar la aplicación.  
> Puede crear un nuevo usuario o utilizar el que se crea por defecto.  
>**Email:** `admin@gmail.com`   
>**Password:** `admin`


## Backend Endpoints

La API del backend expone los siguientes endpoints:

#### Autenticación

*   **Iniciar sesión**:  
    Recurso: http://localhost:8080/exchange-api/v1/auth/login \
    Metodo: POST \
    Body:
    ```json
    {
    	"username": "admin@gmail.com",
    	"password": "admin"
    }
    ```
    
*   **Registrar usuario**:  
    Recurso: http://localhost:8080/exchange-api/v1/auth/register \
    Metodo: POST \
    Body:
    ```json
    {
    	"name": "John",
    	"lastname": "Doe",
    	"username": "jdoe@gmail.com",
    	"password": "demo123"
    }
    ```
    

#### Moneda

*   **Obtener todas las monedas**:  
    Recurso: http://localhost:8080/exchange-api/v1/currencies \
    Metodo: GET 
    
*   **Obtener moneda por código**:  
    Recurso: http://localhost:8080/exchange-api/v1/currencies/{CODIGO} \
    Metodo: GET 
> Asegúrate de reemplazar `{CODIGO}` con el código de la moneda que deseas obtener, por ejemplo `PEN`.
    

#### Tipo de cambio
> `{TOKEN}` es el token de autenticación que se obtiene después de iniciar sesión.

*   **Obtener historial de conversión**:  
    Recurso: http://localhost:8080/exchange-api/v1/rates/conversions?sort=timestamp,desc \
    Metodo: GET \
    Header: `Authorization: Bearer {TOKEN}`
    
*   **Guardar conversión actual**:  
    Recurso: http://localhost:8080/exchange-api/v1/rates \
    Metodo: POST \
    Hader: `Authorization: Bearer {TOKEN}` \
    Body:
    ```json
    {
    	"fromCurrency": "USD",
    	"toCurrency": "EUR",
    	"amount": "10"
    }
    ```
    
*   **Obtener conversión actual**:  
    Recurso: POST http://localhost:8080/exchange-api/v1/rates/conversions \
    Header: `Authorization: Bearer {TOKEN}` \
    Body: 
    ```json
    {
    	"fromCurrency": "USD",
    	"toCurrency": "EUR",
    	"amount": "10"
    }
    ```
