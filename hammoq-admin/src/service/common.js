
exports._isUndefinedOrNull = (value) => {
    if (value === "undefined" || value === null || value === "") {
        return true;
    } else {
        return false;
    }
}
exports.setCurrentUserData = (data) => {
    localStorage.setItem("hammoq-test-admin-user", JSON.stringify(data.data));
    localStorage.setItem("hammoq-test_jwt_token", data.token);
}

exports.getCurrentUserData = (session) => {
    var val = localStorage.getItem(session);
    var data = JSON.parse(val);
    return (data);
};
exports.removeCurrentUserData = () => {
    localStorage.removeItem("hammoq-test-admin-user");
    localStorage.removeItem("hammoq-test_jwt_token");
};

exports.numericValue = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode === 46) {
        return true;
    } else if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        (charCode < 48 || charCode > 57)
    ) {
        return false;
    }
    return true;
}