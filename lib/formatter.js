exports.toHexo = function(data) {

    return {
        layout : 'post',
        engine : 'ejs',
        category : data[0].category,
        title : data[0].name,
        docs : data
    };
};
