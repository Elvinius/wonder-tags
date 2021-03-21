//implement filtering to prevent the unexpected behaviour of the JS
function filterValue (value) {
    return isNaN(value) === false && value !== "" && value !== "Infinity";
};

//Apply bootstrap classes depending on the existence of the errors
export function errorClass(error) {
    return (error.length === 0 ? 'is-valid' : 'is-invalid');
};

//this function will take the input value and will return the filtered and trimmed value array
export function controlData(data) {
    let reg = /\s*(?:;|,|\n|$)\s*/;
    let filteredTags = data.split(reg).filter(value => filterValue(value)).map(v => Number(v.trim()));
    return filteredTags;
};