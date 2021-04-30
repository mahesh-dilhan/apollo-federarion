const { ApolloServer ,gql} = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const countries = [
    {
        name : "US",
        positiveCases : 100
    },
    {
        name : "UK",
        positiveCases: 200
    }
];


const typeDefs = gql`
  extend type Query {
    countries: [Country]
  }
  type Country @key(fields: "name") {
    name: String
    positiveCases: Int
  }
`;

const resolvers = {
    Query: {
        countries() {
            return countries;
        },
        country(parent, args, context, info) {
            return countries.find(country => country.name === args.name);
        }
    },
    Country: {
        __resolveReference(object) {
            return countries.find(country => country.name === object.name);
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

server.listen({ port: 4002 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
