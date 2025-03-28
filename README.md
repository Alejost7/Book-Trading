# Book Trading
## Integrantes
- Diego Alejandro Santander Toro
- Jorge Luis Osorio Quiroga
- Samuel Alberto Bonilla Franco
  
#### Instalar todas las dependencias con el comando "npm run install-all"
#### Renombrar el archivo .env.example a .env y actualizar usuario y contraseña por la que se compartió en el grupo

## Implementación del Flujo de Intercambio

1. Un usuario explora la BookZone para encontrar libros disponibles.
2. Solicita un intercambio seleccionando un libro de otro usuario.
3. El dueño del libro recibe la solicitud y puede aceptarla o rechazarla.
4. Si acepta, se coordina el intercambio, ya sea mediante entrega en persona o un método predefinido.
5. El estado de los libros cambia:
    - Libro solicitado pasa a "En intercambio".
    - Si se completa, pasa a "Intercambiado".


## Acciones clave:

- Un usuario puede ver el historial de sus solicitudes (pendientes, aceptadas, rechazadas).
- Puede cancelar una solicitud antes de que el dueño responda.
- Se pueden agregar calificaciones o comentarios después del intercambio.

## Lógica:

### Interfaz

- En la BookZone, cada libro debe tener un botón "Solicitar intercambio".
- En el perfil de usuario, una pestaña "solicitudes de Intercambio" para gestionar las solicitudes recibidas y enviadas.

### Backend

- Endpoint para listar libros disponibles.
- Endpoint para crear solicitudes de intercambio.
- Endpoint para aceptar/rechazar solicitudes.
- Enpoint para actualizar el estado de un libro tras un intercambio.