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

	const user = await context.db.query.user({ where: {email: args.email }}, `{ id password }`)
	if (!user) {
		throw new Error('No such user found')
	}

	const token = jwt.sign({ userID: user.id }, APP_SECRET)

	return {
		token,
		user,
	}
}

module.exports = {
	signup,
	login,
	post,
}