const { GraphQLServer } = require('graphql-yoga');

const typeDefs = `
type Query {
	info: String!
}
`

const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`
	}
}

const server = new GraphQLServer(
{
	tyepDefs,
	resolvers,
})

server.start(() => console.log(`Server is running on port 4000`))