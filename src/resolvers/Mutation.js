const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');


function post(parent, args, context, info) {
  const userId = getUserId(context)
  return context.db.mutation.createLink(
    {
      data: {
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } },
      },
    },
    info,
  )
}

async function signup(parent, args, context, info) {
	const password = await bcrypt.hash(args.password, 10);

	const user = await context.db.mutation.createUser({
		data: { ...args, password},
	}, `{ id }`)


	const token = jwt.sign({ userID: user.id }, APP_SECRET)

	return {
		token,
		user,
	}
}

async function login(parent, args, context, info) {

	const user = await context.db.query.user({ where: {email: args.email }}, `{ id password }`);

	if (!user) {
		throw new Error('No such user found')
	}

	const token = jwt.sign({ userID: user.id }, APP_SECRET)

	return {
		token,
		user,
	}
}

async function vote(parent, args, context, info) {
	const userId = getUserId(context);

	const linkExists = await context.db.exists.Vote({
		user: { id: userId },
		link: { id: args.linkId },
	})
	if (linkExists) {
		throw new Error(`Already voted for link: ${args.linkId}`)
	}

	return context.db.mutation.createVote(
		{
			data: {
				user: { connect: { id: userId }},
				link: { connect: { id: args.linkId }},
			},
		},
		info,
	)
}

module.exports = {
	signup,
	login,
	post,
	vote,
}