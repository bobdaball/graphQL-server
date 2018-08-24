function feed(parent, args, context, info) {
	return context.db.links({}, info);
}

module.exports = {
	feed,
}