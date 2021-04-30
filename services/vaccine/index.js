const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Vaccine @key(fields: "name") {
    name: String
    country: Country @provides(fields: "name")
  }
  extend type Country @key(fields: "name") {
    name: String @external
    vaccines: [Vaccine]
  }
`;

const resolvers = {
    Vaccine: {
        country(vaccine) {
            return { __typename: "Country", id: vaccine.country };
        }
    },
    Country: {
        vaccines(country) {
            return vaccines.filter(vaccine => vaccine.country === country.name);
        }
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([
        {
            typeDefs,
            resolvers
        }
    ])
});

server.listen({ port: 4004 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});


const vaccines = [
    {
        country: "CHN",
        name: "Synopharm"
    },
    {
        country: "UK",
        name: "AstraZenika"
    },
    {
        country: "US",
        name: "Moderna"
    },
    {
        country: "US",
        name: "Fizer"
    }
];