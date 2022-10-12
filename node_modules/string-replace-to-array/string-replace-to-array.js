// Inspiration: https://github.com/facebook/react/issues/3386

function replace (string, regexpOrSubstr, newValueOrFn, globalOffset) {
	if (typeof string !== 'string') throw new Error('First param must be a string')
	if (typeof regexpOrSubstr !== 'string' && !(regexpOrSubstr instanceof RegExp)) throw new Error('Second param must be a string pattern or a regular expression')

	var fn = (typeof regexpOrSubstr === 'string') ? replaceUsingString : replaceUsingRegexp

	return fn(string, regexpOrSubstr, newValueOrFn, globalOffset)
}

function replaceUsingString (string, patternString, newValueOrFn, globalOffset) {
	var index = string.indexOf(patternString)

	if (index >= 0) {
		var arr = []
		var endIndex = index + patternString.length

		if (index > 0) {
			arr.push(string.substring(0, index))
		}

		arr.push(
			(typeof newValueOrFn === 'function') ?
				newValueOrFn(
					string.substring(index, endIndex),
					index + globalOffset,
					string
				) :
				newValueOrFn
		)

		if (endIndex < string.length) {
			arr.push(string.substring(endIndex))
		}

		return arr
	} else {
		return [string]
	}
}

function replaceUsingRegexp (string, regexp, newValueOrFn, globalOffset) {
	var output = []

	var replacerIsFn = (typeof newValueOrFn === 'function')

	var storedLastIndex = regexp.lastIndex
	regexp.lastIndex = 0

	var result
	var lastIndex = 0
	while (result = regexp.exec(string)) {
		var index = result.index

		if (result[0] === '') {
			// When the regexp is an empty string
			// we still want to advance our cursor to the next item.
			// This is the behavior of String.replace.
			regexp.lastIndex++
		}

		if (index !== lastIndex) {
			output.push(string.substring(lastIndex, index))
		}

		var match = result[0]
		lastIndex = index + match.length
		
		var out = replacerIsFn ?
			newValueOrFn.apply(this, result.concat(index + globalOffset, result.input)) :
			newValueOrFn
		output.push(out)

		if (!regexp.global) {
			break
		}
	}

	if (lastIndex < string.length) {
		output.push(string.substring(lastIndex))
	}

	regexp.lastIndex = storedLastIndex
	return output
}

module.exports = function stringReplaceToArray (stringOrArray, regexpOrSubstr, newSubStrOrFn) {
	if (typeof stringOrArray === 'string') {
		return replace(stringOrArray, regexpOrSubstr, newSubStrOrFn, 0)
	} else if (!Array.isArray(stringOrArray) || !stringOrArray[0]) {
		throw new TypeError('First argument must be an array or non-empty string')
	} else {
		var len = stringOrArray.length
		var output = []
		var globalOffset = 0
		for (var i = 0; i < len; ++i) {
			var arrayItem = stringOrArray[i]
			if (typeof arrayItem === 'string') {
				output.push.apply(output, replace(arrayItem, regexpOrSubstr, newSubStrOrFn, globalOffset))
				globalOffset += arrayItem.length
			} else {
				output.push(arrayItem)
			}
		}
		return output
	}
}