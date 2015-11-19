exports.toHexo = function(data) {

    return {
        layout : 'post',
        engine : 'ejs',
        category : data[0].type,
        title : data[0].name,
        docs : data
    };
};
