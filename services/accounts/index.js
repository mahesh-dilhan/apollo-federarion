const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    name: String
    country: [Country]
  }
  
  extend type Country @key(fields: "name") {
    name: String @external
  }
  
`;

const resolvers = {
    User: {
        __resolveReference(object) {
            return users.find(user => user.id === object.id);
        }
    },
    Country: {
        users(country) {
            return users.filter(user => user.country === country.name);
        }
    },
};

const server = new ApolloServer({
    schema: buildFederatedSchema([
        {
            typeDefs,
            resolvers
        }
    ])
});

server.listen({ port: 4001 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

const users = [
    {
        id: "1",
        name: "Ada Lovelace",
        birthDate: "1815-12-10",
        username: "@ada"
    },
    {
        id: "2",
        name: "Alan Turing",
        birthDate: "1912-06-23",
        username: "@complete"
    }
];