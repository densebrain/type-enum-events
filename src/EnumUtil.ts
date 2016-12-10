

function isNumberValue(o:any) {
	try {
		return parseInt(o,10) >= 0
	} catch (err) {
		return false
	}
}

export function enumKeys(enumType:any) {
	return Object.keys(enumType).filter(key => isNumberValue(key))
}

export function enumValues(enumType:any) {
	return Object.keys(enumType).filter(key => !isNumberValue(key))
}

export function enumValueMap(enumType:any) {
	const
		keys = Object
			.keys(enumType)
			.filter(key => !isNumberValue(key))
	return keys
		.reduce((valueMap,nextVal:string) => {
			valueMap[nextVal] = nextVal
			return valueMap
		},{})
}
