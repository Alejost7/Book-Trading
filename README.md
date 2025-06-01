# Book Trading
## Integrantes
- Diego Alejandro Santander Toro
- Jorge Luis Osorio Quiroga
- Samuel Alberto Bonilla Franco
  
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
- Se pueden donar libros, las donaciones son permanentes

## Lógica:

### Interfaz

- En la BookZone, cada libro debe tener un botón "Solicitar intercambio".

### Backend

- Endpoint para listar libros disponibles.
- Endpoint para crear solicitudes de intercambio.
- Endpoint para aceptar/rechazar solicitudes.
- Enpoint para actualizar el estado de un libro tras un intercambio.
- Endpoint para donar un libro.
- Otros Endpoints importantes...


### Definición del Flujo de Donaciones e Intercambio
1. Un usuario dona un libro
    - El usuario elige un libro de su lista y lo marca como donado.
    - Este libro pasa a estar disponible para cualquiera que quiera intercambiar.
    - El libro se asigna a un usuario especial (puede ser un "Admin" o "Biblioteca").

2. Alguien quiere intercambiar por un libro donado
    - El usuario elige un libro de la lista de donaciones.
    - Debe ofrecer uno de sus propios libros a cambio.
    - El sistema realiza automáticamente el intercambio.
    - El libro donado desaparece de la lista de donaciones y aparece en la biblioteca del nuevo dueño.
    - El usuario especial (Admin/Biblioteca) recibe el libro intercambiado.
