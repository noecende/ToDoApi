<p align="center"><img src="assets/graphQL.png" width="100"/></p>
<p align="center">
    <h1 align="center">
        <span>To-Do App</span><br>
        <span>API GraphQL para aplicación de una lista ToDo.</span>
    </h1>
</p>

## Ver Demo
- Puedes revisar la API en https://noecende-todo.herokuapp.com/graphql con tu cliente GraphQL de preferencia.

## Consideraciones

- El proyecto contiene una configuración para utilizarse con **DockerCompose**.
- Este es una demo de una API en GraphQL para una lista ToDo. 
- Utiliza **IoC** e **Inyección de dependencias** a un nivel básico con TypeDI.
- Se utiliza Prisma.io como ORM.
- Incluye querys, mutations y subscriptions.
- Se usa el PubSub default de ApolloServer. Para producción debería implementarse una biblioteca como el servicio de Google PubSub.
- Evité el uso del patrón de **repositorios** puesto que es un ejemplo básico de GraphQL.
