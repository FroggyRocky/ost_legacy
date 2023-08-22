function required(value) {
    return value ? null : 'Field is required' 
};

function maxValue(maxNum, fieldName) {
    return (value) => 
    value && value.length > maxNum ? `${fieldName} must be less than ${fieldName} symbols` : null;
}

function minValue(minNum, fieldName) {
    return (value) => 
    value && value.length < minNum ? `${fieldName} must be more than ${minNum} symbols` : null
}

function emailVal(value) {
    return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
    'Invalid email address' : undefined
}



export {emailVal,minValue,maxValue,required}