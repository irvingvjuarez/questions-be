export const getRequestParam = (requestParam, res, errorMsg, status = 404) => {
	const isParamMissing = !requestParam

	if (isParamMissing) {
		res.status(status).send(errorMsg)
	}

	return { isParamMissing, param: requestParam }
}