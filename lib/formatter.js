exports.toHexo = function(data) {

    data.layout   = 'post';
    data.engine   = 'ejs';
    data.category = data.type;
    data.title    = data.name;
    delete data.type;
    delete data.name;

    return data;
};
