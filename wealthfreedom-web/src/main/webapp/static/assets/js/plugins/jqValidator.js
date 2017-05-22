//扩展String的bytelength方法
String.prototype.bytelength = function() {
    var arr = this.match(/[^\x00-\xff]/ig);
    return this.length + (arr == null ? 0 : arr.length);  0
};
var ErrorAlertCn = [
    ["validate-required", "%1为必填项不能为空。"],
    ["validate-number", "请输入有效的数字。"],
    ["validate-mobile", "请输入正确的手机号码。"],
    ["validate-phone","请输入正确的固定电话号码。"],
    ["validate-call","请输入正确的固定电话和手机号码。"],
    ["validate-digits", "请输入整数。"],
    ["validate-date", "请输入有效的日期。"],
    ["validate-time", "请输入有效的日期和时间。"],
    ['validate-zip', "请输入正确的邮政编码。"],
    ['validate-idcardno', "请输入正确的身份证号码。"],
    ["validate-email", "请输入有效的邮件地址，如 username@example.com."],
    ["validate-password", "请将字符长度限制在6-24之间"],
    ["validate-maxlength", "请缩减到%1字符以内"],
    ["validate-maxbytelength", "请缩减到%1字符以内，中文占两个字符"]
];
var ErrorAlertEn = [];
var rulesSource = [
    ["validate-required", isNotEmpty],
    ["validate-number", isNumber],
    ["validate-mobile", isMobileNo],
    ["validate-phone", isPhoneNo],
    ["validate-call", isCallNo],
    ["validate-digits", isDigits],
    ["validate-date", isDate],
    ["validate-time", isTime],
    ["validate-zip", isZip],
    ["validate-idcardno", isIDCardNo],
    ["validate-email", isEmail],
    ["validate-password", IsPassword],
    ["validate-maxlength", checkLength],
    ["validate-maxbytelength", checkByteLength]
];
function isNotEmpty(str) {
    return !(str == null || str.length == 0);
}
function isNumber(v) {
    return (!isNaN(v) && !/^\s+$/.test(v));
}
function isMobileNo(v) {
    return v.length == 0 || /^[-]{0,1}\d{8,13}$/.test(v);
}
function isPhoneNo(v) {
    return v.length == 0 || /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,4}))?$/.test(v) || /^0085[23]-[1-9]\d{7}(-(\d{3,4}))?$/.test(v) ;
}
function isCallNo(v) {
    return v.length == 0 || /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,4}))?$/.test(v) || /^0085[23]-[1-9]\d{7}(-(\d{3,4}))?$/.test(v) || /^[-]{0,1}\d{8,13}$/.test(v);
}
function isDigits(v) {
    return !/[^\d]/.test(v);
}
function isDate(v) {
    return /^((((1[6-9]|[2-9]\d)\d{2})[-](0?[13578]|1[02])[-](0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})[-](0?[13456789]|1[012])[-](0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})[-]0?2[-](0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29))$/.test(v);
}
function isEmail(v) {
    return v.toString() == "" ? true : /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/.test(v);
}
function isZip(v) {
    return v.toString() == "" ? true : (/^[0-9]\d{5}$/.test(v));
}

function isIDCardNo(v) {
    return v.toString() == "" ? true : (/^\d{15}(\d{2}[0-9X])?$/.test(v));
}
function isTime(v) {
    return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(v);
}
function IsPassword(str) {
    return ((str.length >= 6 && str.length <= 24) || str.length == 0);
}
function checkLength(str) {
    return (str.length <= this.params[0]);
}
function checkByteLength(str) {
    return (str.bytelength() <= this.params[0]);
}
var JqValidatorHelper = {

    twoDepthArrayToErrorObject: function(array) {
        var obj = {};

        $.each(array, function(i) {
            obj[array[i][0]] = array[i][1];
        });
        return obj;
    },

    twoDepthArrayToRuleObject: function(array) {
        var obj = {};
        $.each(array, function(i) {
            obj[array[i][0]] = new JqValidatorRule(array[i][0], array[i][1]);
        });
        return obj;
    },
    getRuleName: function(className) {

        var ruleNameResult;
        for (var ruleName in JqValidator.rules) {
            if (className == ruleName) {
                ruleNameResult = ruleName;
                break;
            }
            if (className.indexOf(ruleName) >= 0) {
                ruleNameResult = ruleName;
            }
        }
        return ruleNameResult;
    },
    getRule: function(className) {
        var arr = className.split("-");
        var ruleNameResult;
        var params;
        if (arr.length > 2) {
            ruleNameResult = arr.slice(0, 2).join("-");
            params = arr.slice(2, arr.length);
        }
        else {
            ruleNameResult = JqValidatorHelper.getRuleName(className);
        }
        if (JqValidator.rules[ruleNameResult]) {
            JqValidator.rules[ruleNameResult].params = params;
            return JqValidator.rules[ruleNameResult];
        }
        return new JqValidatorRule();
    },
    _getInputValue: function(elmIn) {
        return elmIn.value;
    }

};
var JqValidatorRule = function(className, test) {
    this.className = className;
    this._test = test ? test : function(v, elm) {
        return true
    };

};
JqValidatorRule.prototype.test = function(v, elm) {
    return this._test(v, elm)
}


var JqValidator = function() {
}
JqValidator.lang = "zh-cn";
JqValidator.rules = JqValidatorHelper.twoDepthArrayToRuleObject(rulesSource);
JqValidator.errorCn = JqValidatorHelper.twoDepthArrayToErrorObject(ErrorAlertCn);
JqValidator.errorEn = JqValidatorHelper.twoDepthArrayToErrorObject(ErrorAlertEn);
JqValidator.prototype.container = null;
JqValidator.prototype.showError = false;
JqValidator.prototype.validate = function() {

    var result = true;
    var elms = null;
    if (this.container == null) {
        elms = $(":text:visible,textarea:visible,select:visible,:password:visible");
    }
    else {
        elms = this.container.find(":text:visible,textarea:visible,select:visible,:password:visible");
    }

    for (var i = 0; i < elms.length; i++) {
        if (!this.validateElm(elms[i])) {
            result = false;
        }
    }
    return result;
}

JqValidator.prototype.validateElm = function(elm) {
    var classNames = elm.className.split(" ");
    var result = true;
    for (var i = 0; i < classNames.length && result; i++) {
        var result = this.testRule(classNames[i], elm);
    }
    return result;
}
JqValidator.prototype.testRule = function(className, elm) {
    $(elm).next().remove(".validation-advice");
    if (className.indexOf("validate-custom-") == 0) {
        var methodName = className.substring("validate-custom-".length, className.length);
        if (!window[methodName].apply(elm)) {
            if (window[methodName + "FailedInfo"]) {
                elm.title = window[methodName + "FailedInfo"];
            }
            $(elm).addClass("validation-failed");
            if (this.showError === true) {
                $(elm).after("<span class='validation-advice'>" + elm.title + "</span>");
            }
            return false;
        }
        else {
            $(elm).removeClass("validation-failed");
            elm.title = "";
            return true;
        }
    }
    else {
        var rule = JqValidatorHelper.getRule(className);
        if (!rule.test(JqValidatorHelper._getInputValue(elm), elm)) {
            switch (JqValidator.lang) {
                case "zh-cn":
                    elm.title = JqValidator.errorCn[rule.className];
                    break;
                case "en-US":
                    elm.title = JqValidator.errorEn[rule.className];
                    break;
            }
            if (rule.params) {
                elm.title = elm.title.replace("%1", rule.params[0] || "").replace("%2", rule.params[1] || "");
            }
            $(elm).addClass("validation-failed");
            if (this.showError === true) {
                $(elm).after("<span class='validation-advice'>" + elm.title + "</span>");
            }
            return false;
        }
        else {
            $(elm).removeClass("validation-failed");
            elm.title = "";
            return true;
        }
    }
}