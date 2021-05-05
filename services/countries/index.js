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
    },
    {
        name : "CHN",
        positiveCases: 890
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
   type Mutation {
    post(country: String!, positiveCases: Int!): [Country]
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
    },
    Mutation: {
        post: (parent, args) => {
            const country = {
                name: args.country,
                positiveCases: args.positiveCases,
            }
            //console.log(country.name);
            let exists =false;
            countries.forEach((x) => {
                if (x.name === country.name) {
                    x.positiveCases = country.positiveCases;
                    exists=true;
                    return;
                }
            });

            if(!exists) {
                countries.push(country);
            }
           //console.log(countries);
            return countries;
        }
    }
};

function _isContains(json, keyname, value) {

    return Object.keys(json).some(key => {
        return typeof json[key] === 'object' ?
            _isContains(json[key], keyname, value) : key === keyname && json[key] === value;
    });
}

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
