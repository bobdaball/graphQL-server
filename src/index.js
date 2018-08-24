const { GraphQLServer } = require('graphql-yoga');

// 1
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
    	return context.db.query.link({}, info)
    },
  },
  Mutation: {
    // 2
    post: (root, args, context, info) => {
       return context.db.mutation.createLink({
       	data: {
       		url: args.url,
       		description: args.description
       	},
       }, info)
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})

server.start(() => console.log(`Server is running on port 4000`))