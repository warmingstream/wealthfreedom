/**
 * Created by changjiang3 on 2016/4/27.
 */

/**
 * 表单校验
 * @param formId
 * @returns {*|jQuery}
 */
function isValid(formId) {
    var selector = "#" + formId;
    $(selector).validator({
        ignore: 'hidden'
    });
    $(selector).trigger("validate");
    return $(selector).isValid();
}
