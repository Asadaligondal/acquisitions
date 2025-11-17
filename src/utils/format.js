export const formatValidationErrors = (errors) => {
    if(!errors || errors.length === 0) return "Validation Failed";

    if(Array.isArray(errors.issues)) return errors.issues.map(issue => issues.message).join(', ');

    return JSON.stringify(errors);

}