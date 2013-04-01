function super_textfield (opt) {
    var KEYCODE_ENTER = 13,
        KEYCODE_TAB   = 9,
        KEYCODE_BACKSPACE = 8,
        KEYCODE_UP = 38,
        KEYCODE_DOWN = 40,
        KEYCODE_ESC = 27;
    var $container = opt.container,
        $input = $('<input id="tf-input" type="text">').appendTo($('<div id="tf-editor">').appendTo($container)),
        suggestion_template = opt.suggestion_template,
        $suggestion_area = $('<div id="tf-suggestion">').appendTo($container) ,
        $icons = opt.icons;
    var keydown_timer;
    var firefox = document.body.innerText === undefined;

    main(opt.fields, opt);

    function main (fields, opt) {
        var edit_mode = 0;
        var current_data = [];
        var current_suggestion = [],
            suggestion_index = 0, //focused suggestion
            suggestion_size = 0;

        function set_edit_mode (i) {
            $icons.eq(edit_mode).addClass('hidden');
            $icons.eq(i).removeClass('hidden');
            edit_mode = i;
            $input.keydown();
        }

        $input.blur(function () {
            $suggestion_area.html('');
            clearTimeout(keydown_timer);
        });

        $input.keydown(function (e) {
            //ENTERまたはTABで確定
            if (e.which === KEYCODE_ENTER || e.which === KEYCODE_TAB) {
                e.preventDefault();
                current_data[edit_mode] = current_suggestion[suggestion_index]; //push to the model

                if (edit_mode === fields.length - 1) {
                    //call enter listener if everything has beeen entered
                    opt.enter(current_data);
                    $container.find('.tf-item').remove();
                    set_edit_mode(0);
                    current_data = [];
                }
                else {
                    //create tf-item
                    $input.before($('<span class="tf-item">')
                          .text(current_suggestion[suggestion_index].item_string)
                          .append($('<span class="gray">').text(fields[edit_mode].postfix)));
                    //increment edit_mode
                    set_edit_mode(edit_mode + 1);
                    $input.val('');
                }

                //reset suggestion
                $suggestion_area.html('');
                current_suggestion = [];
                suggestion_index = 0;
                suggestion_size = 0;

                return;
            }
            //if backspace has been pressed and the cursor was at the head of the line,
            // delete previous tf-item decrement edit-mode
            if (e.which === KEYCODE_BACKSPACE && $input[0].selectionStart === 0) {
                if (edit_mode > 0) set_edit_mode(edit_mode - 1);
                $container.find('.tf-item:last').remove();
                return;
            }
            //clear suggestion on Esc
            if (e.which === KEYCODE_ESC) {
                $suggestion_area.html('');
                return;
            }

            var drawn_suggestions = $suggestion_area.children();

            //UP,DOWN to navigate through suggestions
            if (e.which === KEYCODE_UP) {
                drawn_suggestions.eq(suggestion_index).removeClass('act');
                if (suggestion_index <= 0)
                    suggestion_index = suggestion_size - 1;
                else
                    suggestion_index -= 1;
                drawn_suggestions.eq(suggestion_index).addClass('act');
                return;
            }
            if (e.which === KEYCODE_DOWN) {
                drawn_suggestions.eq(suggestion_index).removeClass('act');
                if (suggestion_index >= suggestion_size - 1)
                    suggestion_index = 0;
                else
                    suggestion_index += 1;
                drawn_suggestions.eq(suggestion_index).addClass('act');
                return;
            }

            setTimeout(function () {
                var suggestions;
                if (fields[edit_mode].data.length === 0) //free input
                    suggestions = [itemify($input.val())];
                else suggestions = _.filter(fields[edit_mode].data, function (proj) {
                    if ($input.val() === '') return true;
                    return proj.item_string.toUpperCase().indexOf($input.val().toUpperCase()) > -1;
                });
                var htmls = _.map(suggestions, function (proj) {
                    return _.template(suggestion_template, {
                        it: proj.item_string
                    });
                });

                $suggestion_area.html(htmls.join(''));
                suggestion_index = 0; //reset suggestion_index and size
                suggestion_size  = suggestions.length;
                $suggestion_area.children().eq(suggestion_index).addClass('act');
                current_suggestion = suggestions;
            }, 0);

            //firefox hack for IME input
            if (firefox) {
                var prev_val = $input.val();
                var f;
                keydown_timer = setTimeout(f = function () {
                    if ($input.val() !== prev_val)
                        $input.keydown();
                    else keydown_timer = setTimeout(f, 500);
                }, 500);
            }

        });
        $input.focus();
    }

    $container.click(function () {
        $input.focus();
    });
}


function itemify (x) { return {item_string: x+''}; }
