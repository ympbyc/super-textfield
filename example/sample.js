$(function () {
    super_textfield({
        container: $('#editor-wrapper'),
        fields: [{
            data: [],
            postfix: ''
        }, {
            data: _.range(0, 100).map(itemify),
            postfix: 'years'
        }, {
            data: [{id: 100,  item_string: 'Common Lisp'},
                   {id: 300,  item_string: 'Haskell'},
                   {id: 101,  item_string: 'Scheme'},
                   {id: 102,  item_string: 'Clojure'},
                   {id: 200,  item_string: 'SML'},
                   {id: 201,  item_string: 'OCaml'},
                   {id: 400,  item_string: 'Factor'},
                   {id: 1000, item_string: 'Other Language'}],
            postfix: ''
        }, {
            data: [itemify('OK')],
            postfix: ''
        }],
        enter: function (data) {
            $('#tf-result').text('You sent ' + JSON.stringify(data));
        },
        suggestion_template: $('#suggestion-template').html(),
        icons: $('#edit-mode-icons').children()
    });
});
