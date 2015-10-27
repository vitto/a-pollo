exports.toHexo = function(data) {

    data.layout   = 'post';
    data.engine   = 'ejs';
    data.category = data.type;
    data.title    = data.name;

    return data;
};
