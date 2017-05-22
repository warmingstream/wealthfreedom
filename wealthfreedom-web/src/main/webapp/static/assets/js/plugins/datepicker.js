/**
 *
 * Date picker
 * Author: Stefan Petre www.eyecon.ro
 *
 * Dual licensed under the MIT and GPL licenses
 *
 */
Date.dayNames = ["\u661F\u671F\u65E5","\u661F\u671F\u4E00","\u661F\u671F\u4E8C","\u661F\u671F\u4E09","\u661F\u671F\u56DB","\u661F\u671F\u4E94","\u661F\u671F\u516D"];
Date.abbrDayNames = ["\u5468\u65E5","\u5468\u4E00","\u5468\u4E8C","\u5468\u4E09","\u5468\u56DB","\u5468\u4E94","\u5468\u516D"];
Date.monthNames = ["\u4E00\u6708","\u4E8C\u6708","\u4E09\u6708","\u56DB\u6708","\u4E94\u6708","\u516D\u6708","\u4E03\u6708","\u516B\u6708","\u4E5D\u6708","\u5341\u6708","\u5341\u4E00\u6708","\u5341\u4E8C\u6708"];
Date.abbrMonthNames = ["\u4E00","\u4E8C","\u4E09","\u56DB","\u4E94","\u516D","\u4E03","\u516B","\u4E5D","\u5341","\u5341\u4E00","\u5341\u4E8C"];
Date.firstDayOfWeek = 1;
Date.format = "yyyy-mm-dd";
Date.fullYearStart = "20";
(function() {
    function b(c, d) {
        if (!Date.prototype[c]) {
            Date.prototype[c] = d
        }
    }

    b("isLeapYear", function() {
        var c = this.getFullYear();
        return(c % 4 == 0 && c % 100 != 0) || c % 400 == 0
    });
    b("isWeekend", function() {
        return this.getDay() == 0 || this.getDay() == 6
    });
    b("isWeekDay", function() {
        return !this.isWeekend()
    });
    b("getDaysInMonth", function() {
        return[31,(this.isLeapYear() ? 29 : 28),31,30,31,30,31,31,30,31,30,31][this.getMonth()]
    });
    b("getDayName", function(c) {
        return c ? Date.abbrDayNames[this.getDay()] : Date.dayNames[this.getDay()]
    });
    b("getMonthName", function(c) {
        return c ? Date.abbrMonthNames[this.getMonth()] : Date.monthNames[this.getMonth()]
    });
    b("getDayOfYear", function() {
        var c = new Date("1/1/" + this.getFullYear());
        return Math.floor((this.getTime() - c.getTime()) / 86400000)
    });
    b("getWeekOfYear", function() {
        return Math.ceil(this.getDayOfYear() / 7)
    });
    b("setDayOfYear", function(c) {
        this.setMonth(0);
        this.setDate(c);
        return this
    });
    b("addYears", function(c) {
        this.setFullYear(this.getFullYear() + c);
        return this
    });
    b("addMonths", function(d) {
        var c = this.getDate();
        this.setMonth(this.getMonth() + d);
        if (c > this.getDate()) {
            this.addDays(-this.getDate())
        }
        return this
    });
    b("addDays", function(c) {
        this.setTime(this.getTime() + (c * 86400000));
        return this
    });
    b("addHours", function(c) {
        this.setHours(this.getHours() + c);
        return this
    });
    b("addMinutes", function(c) {
        this.setMinutes(this.getMinutes() + c);
        return this
    });
    b("addSeconds", function(c) {
        this.setSeconds(this.getSeconds() + c);
        return this
    });
    b("zeroTime", function() {
        this.setMilliseconds(0);
        this.setSeconds(0);
        this.setMinutes(0);
        this.setHours(0);
        return this
    });
    b("asString", function(d) {
        var c = d || Date.format;
        if (c.split("mm").length > 1) {
            c = c.split("mmmm").join(this.getMonthName(false)).split("mmm").join(this.getMonthName(true)).split("mm").join(a(this.getMonth() + 1))
        } else {
            c = c.split("m").join(this.getMonth() + 1)
        }
        c = c.split("yyyy").join(this.getFullYear()).split("yy").join((this.getFullYear() + "").substring(2)).split("dd").join(a(this.getDate())).split("d").join(this.getDate());
        return c
    });
    Date.fromString = function(t) {
        var n = Date.format;
        var p = new Date("01/01/1970");
        if (t == "") {
            return p
        }
        t = t.toLowerCase();
        var m = "";
        var e = [];
        var c = /(dd?d?|mm?m?|yy?yy?)+([^(m|d|y)])?/g;
        var k;
        while ((k = c.exec(n)) != null) {
            switch (k[1]) {case"d":case"dd":case"m":case"mm":case"yy":case"yyyy":m += "(\\d+\\d?\\d?\\d?)+";e.push(k[1].substr(0, 1));break;case"mmm":m += "([a-z]{3})";e.push("M");break
            }
            if (k[2]) {
                m += k[2]
            }
        }
        var l = new RegExp(m);
        var q = t.match(l);
        for (var h = 0; h < e.length; h++) {
            var o = q[h + 1];
            switch (e[h]) {case"d":p.setDate(o);break;case"m":p.setMonth(Number(o) - 1);break;case"M":for (var g = 0; g < Date.abbrMonthNames.length; g++) {
                if (Date.abbrMonthNames[g].toLowerCase() == o) {
                    break
                }
            }p.setMonth(g);break;case"y":p.setYear(o);break
            }
        }
        return p
    };
    var a = function(c) {
        var d = "0" + c;
        return d.substring(d.length - 2)
    }
})();

(function ($) {
    var DatePicker = function () {
        var ids = {},
                views = {
                    years: 'datepickerViewYears',
                    moths: 'datepickerViewMonths',
                    days: 'datepickerViewDays'
                },
                tpl = {
                    wrapper: '<div class="datepicker"><div class="datepickerBorderT" /><div class="datepickerBorderB" /><div class="datepickerBorderL" /><div class="datepickerBorderR" /><div class="datepickerBorderTL" /><div class="datepickerBorderTR" /><div class="datepickerBorderBL" /><div class="datepickerBorderBR" /><div class="datepickerContainer"><table cellspacing="0" cellpadding="0"><tbody><tr></tr></tbody></table></div></div>',
                    head: [
                        '<td>',
                        '<table cellspacing="0" cellpadding="0">',
                        '<thead>',
                        '<tr>',
                        '<th class="datepickerGoPrev"><a href="#"><span><%=prev%></span></a></th>',
                        '<th colspan="6" class="datepickerMonth"><a href="#"><span></span></a></th>',
                        '<th class="datepickerGoNext"><a href="#"><span><%=next%></span></a></th>',
                        '</tr>',
                        '<tr class="datepickerDoW">',
                        '<th><span><%=week%></span></th>',
                        '<th><span><%=day1%></span></th>',
                        '<th><span><%=day2%></span></th>',
                        '<th><span><%=day3%></span></th>',
                        '<th><span><%=day4%></span></th>',
                        '<th><span><%=day5%></span></th>',
                        '<th><span><%=day6%></span></th>',
                        '<th><span><%=day7%></span></th>',
                        '</tr>',
                        '</thead>',
                        '</table></td>'
                    ],
                    space : '<td class="datepickerSpace"><div></div></td>',
                    days: [
                        '<tbody class="datepickerDays">',
                        '<tr>',
                        '<th class="datepickerWeek"><a href="#" class="week_range"><span><%=weeks[0].week%></span></a></th>',
                        '<td class="<%=weeks[0].days[0].classname%>"><a href="#"><span><%=weeks[0].days[0].text%></span></a></td>',
                        '<td class="<%=weeks[0].days[1].classname%>"><a href="#"><span><%=weeks[0].days[1].text%></span></a></td>',
                        '<td class="<%=weeks[0].days[2].classname%>"><a href="#"><span><%=weeks[0].days[2].text%></span></a></td>',
                        '<td class="<%=weeks[0].days[3].classname%>"><a href="#"><span><%=weeks[0].days[3].text%></span></a></td>',
                        '<td class="<%=weeks[0].days[4].classname%>"><a href="#"><span><%=weeks[0].days[4].text%></span></a></td>',
                        '<td class="<%=weeks[0].days[5].classname%>"><a href="#"><span><%=weeks[0].days[5].text%></span></a></td>',
                        '<td class="<%=weeks[0].days[6].classname%>"><a href="#"><span><%=weeks[0].days[6].text%></span></a></td>',
                        '</tr>',
                        '<tr>',
                        '<th class="datepickerWeek"><a href="#" class="week_range"><span><%=weeks[1].week%></span></a></th>',
                        '<td class="<%=weeks[1].days[0].classname%>"><a href="#"><span><%=weeks[1].days[0].text%></span></a></td>',
                        '<td class="<%=weeks[1].days[1].classname%>"><a href="#"><span><%=weeks[1].days[1].text%></span></a></td>',
                        '<td class="<%=weeks[1].days[2].classname%>"><a href="#"><span><%=weeks[1].days[2].text%></span></a></td>',
                        '<td class="<%=weeks[1].days[3].classname%>"><a href="#"><span><%=weeks[1].days[3].text%></span></a></td>',
                        '<td class="<%=weeks[1].days[4].classname%>"><a href="#"><span><%=weeks[1].days[4].text%></span></a></td>',
                        '<td class="<%=weeks[1].days[5].classname%>"><a href="#"><span><%=weeks[1].days[5].text%></span></a></td>',
                        '<td class="<%=weeks[1].days[6].classname%>"><a href="#"><span><%=weeks[1].days[6].text%></span></a></td>',
                        '</tr>',
                        '<tr>',
                        '<th class="datepickerWeek"><a href="#" class="week_range"><span><%=weeks[2].week%></span></a></th>',
                        '<td class="<%=weeks[2].days[0].classname%>"><a href="#"><span><%=weeks[2].days[0].text%></span></a></td>',
                        '<td class="<%=weeks[2].days[1].classname%>"><a href="#"><span><%=weeks[2].days[1].text%></span></a></td>',
                        '<td class="<%=weeks[2].days[2].classname%>"><a href="#"><span><%=weeks[2].days[2].text%></span></a></td>',
                        '<td class="<%=weeks[2].days[3].classname%>"><a href="#"><span><%=weeks[2].days[3].text%></span></a></td>',
                        '<td class="<%=weeks[2].days[4].classname%>"><a href="#"><span><%=weeks[2].days[4].text%></span></a></td>',
                        '<td class="<%=weeks[2].days[5].classname%>"><a href="#"><span><%=weeks[2].days[5].text%></span></a></td>',
                        '<td class="<%=weeks[2].days[6].classname%>"><a href="#"><span><%=weeks[2].days[6].text%></span></a></td>',
                        '</tr>',
                        '<tr>',
                        '<th class="datepickerWeek"><a href="#" class="week_range"><span><%=weeks[3].week%></span></a></th>',
                        '<td class="<%=weeks[3].days[0].classname%>"><a href="#"><span><%=weeks[3].days[0].text%></span></a></td>',
                        '<td class="<%=weeks[3].days[1].classname%>"><a href="#"><span><%=weeks[3].days[1].text%></span></a></td>',
                        '<td class="<%=weeks[3].days[2].classname%>"><a href="#"><span><%=weeks[3].days[2].text%></span></a></td>',
                        '<td class="<%=weeks[3].days[3].classname%>"><a href="#"><span><%=weeks[3].days[3].text%></span></a></td>',
                        '<td class="<%=weeks[3].days[4].classname%>"><a href="#"><span><%=weeks[3].days[4].text%></span></a></td>',
                        '<td class="<%=weeks[3].days[5].classname%>"><a href="#"><span><%=weeks[3].days[5].text%></span></a></td>',
                        '<td class="<%=weeks[3].days[6].classname%>"><a href="#"><span><%=weeks[3].days[6].text%></span></a></td>',
                        '</tr>',
                        '<tr>',
                        '<th class="datepickerWeek"><a href="#" class="week_range"><span><%=weeks[4].week%></span></a></th>',
                        '<td class="<%=weeks[4].days[0].classname%>"><a href="#"><span><%=weeks[4].days[0].text%></span></a></td>',
                        '<td class="<%=weeks[4].days[1].classname%>"><a href="#"><span><%=weeks[4].days[1].text%></span></a></td>',
                        '<td class="<%=weeks[4].days[2].classname%>"><a href="#"><span><%=weeks[4].days[2].text%></span></a></td>',
                        '<td class="<%=weeks[4].days[3].classname%>"><a href="#"><span><%=weeks[4].days[3].text%></span></a></td>',
                        '<td class="<%=weeks[4].days[4].classname%>"><a href="#"><span><%=weeks[4].days[4].text%></span></a></td>',
                        '<td class="<%=weeks[4].days[5].classname%>"><a href="#"><span><%=weeks[4].days[5].text%></span></a></td>',
                        '<td class="<%=weeks[4].days[6].classname%>"><a href="#"><span><%=weeks[4].days[6].text%></span></a></td>',
                        '</tr>',
                        '<tr>',
                        '<th class="datepickerWeek"><a href="#" class="week_range"><span><%=weeks[5].week%></span></a></th>',
                        '<td class="<%=weeks[5].days[0].classname%>"><a href="#"><span><%=weeks[5].days[0].text%></span></a></td>',
                        '<td class="<%=weeks[5].days[1].classname%>"><a href="#"><span><%=weeks[5].days[1].text%></span></a></td>',
                        '<td class="<%=weeks[5].days[2].classname%>"><a href="#"><span><%=weeks[5].days[2].text%></span></a></td>',
                        '<td class="<%=weeks[5].days[3].classname%>"><a href="#"><span><%=weeks[5].days[3].text%></span></a></td>',
                        '<td class="<%=weeks[5].days[4].classname%>"><a href="#"><span><%=weeks[5].days[4].text%></span></a></td>',
                        '<td class="<%=weeks[5].days[5].classname%>"><a href="#"><span><%=weeks[5].days[5].text%></span></a></td>',
                        '<td class="<%=weeks[5].days[6].classname%>"><a href="#"><span><%=weeks[5].days[6].text%></span></a></td>',
                        '</tr>',
                        '<tr>',
                        '<td colspan="8">时间：' +
                                '<select name="hour" class="hour">' +
                                '<option value="00">00</option>' +
                                '<option value="01">01</option>' +
                                '<option value="02">02</option>' +
                                '<option value="03">03</option>' +
                                '<option value="04">04</option>' +
                                '<option value="05">05</option>' +
                                '<option value="06">06</option>' +
                                '<option value="07">07</option>' +
                                '<option value="08">08</option>' +
                                '<option value="09">09</option>' +
                                '<option value="10">10</option>' +
                                '<option value="11">11</option>' +
                                '<option value="12">12</option>' +
                                '<option value="13">13</option>' +
                                '<option value="14">14</option>' +
                                '<option value="15">15</option>' +
                                '<option value="16">16</option>' +
                                '<option value="17">17</option>' +
                                '<option value="18">18</option>' +
                                '<option value="19">19</option>' +
                                '<option value="20">20</option>' +
                                '<option value="21">21</option>' +
                                '<option value="22">22</option>' +
                                '<option value="23">23</option>' +
                                '</select>&nbsp;:&nbsp;' +
                                '<select name="minute" class="minute">' +
                                '<option value="00">00</option>' +
                                '<option value="01">01</option>' +
                                '<option value="02">02</option>' +
                                '<option value="03">03</option>' +
                                '<option value="04">04</option>' +
                                '<option value="05">05</option>' +
                                '<option value="06">06</option>' +
                                '<option value="07">07</option>' +
                                '<option value="08">08</option>' +
                                '<option value="09">09</option>' +
                                '<option value="10">10</option>' +
                                '<option value="11">11</option>' +
                                '<option value="12">12</option>' +
                                '<option value="13">13</option>' +
                                '<option value="14">14</option>' +
                                '<option value="15">15</option>' +
                                '<option value="16">16</option>' +
                                '<option value="17">17</option>' +
                                '<option value="18">18</option>' +
                                '<option value="19">19</option>' +
                                '<option value="20">20</option>' +
                                '<option value="21">21</option>' +
                                '<option value="22">22</option>' +
                                '<option value="23">23</option>' +
                                '<option value="24">24</option>' +
                                '<option value="25">25</option>' +
                                '<option value="26">26</option>' +
                                '<option value="27">27</option>' +
                                '<option value="28">28</option>' +
                                '<option value="29">29</option>' +
                                '<option value="30">30</option>' +
                                '<option value="31">31</option>' +
                                '<option value="32">32</option>' +
                                '<option value="33">33</option>' +
                                '<option value="23">23</option>' +
                                '<option value="34">34</option>' +
                                '<option value="35">35</option>' +
                                '<option value="36">36</option>' +
                                '<option value="37">37</option>' +
                                '<option value="38">38</option>' +
                                '<option value="39">39</option>' +
                                '<option value="40">40</option>' +
                                '<option value="41">41</option>' +
                                '<option value="42">42</option>' +
                                '<option value="43">43</option>' +
                                '<option value="44">44</option>' +
                                '<option value="45">45</option>' +
                                '<option value="46">46</option>' +
                                '<option value="47">47</option>' +
                                '<option value="48">48</option>' +
                                '<option value="49">49</option>' +
                                '<option value="50">50</option>' +
                                '<option value="51">51</option>' +
                                '<option value="52">52</option>' +
                                '<option value="53">53</option>' +
                                '<option value="54">54</option>' +
                                '<option value="55">55</option>' +
                                '<option value="56">56</option>' +
                                '<option value="57">57</option>' +
                                '<option value="58">58</option>' +
                                '<option value="59">59</option>' +
                                '</select>&nbsp;:&nbsp;' +
                                '<select name="second" class="second">' +
                                '<option value="00">00</option>' +
                                '<option value="01">01</option>' +
                                '<option value="02">02</option>' +
                                '<option value="03">03</option>' +
                                '<option value="04">04</option>' +
                                '<option value="05">05</option>' +
                                '<option value="06">06</option>' +
                                '<option value="07">07</option>' +
                                '<option value="08">08</option>' +
                                '<option value="09">09</option>' +
                                '<option value="10">10</option>' +
                                '<option value="11">11</option>' +
                                '<option value="12">12</option>' +
                                '<option value="13">13</option>' +
                                '<option value="14">14</option>' +
                                '<option value="15">15</option>' +
                                '<option value="16">16</option>' +
                                '<option value="17">17</option>' +
                                '<option value="18">18</option>' +
                                '<option value="19">19</option>' +
                                '<option value="20">20</option>' +
                                '<option value="21">21</option>' +
                                '<option value="22">22</option>' +
                                '<option value="23">23</option>' +
                                '<option value="24">24</option>' +
                                '<option value="25">25</option>' +
                                '<option value="26">26</option>' +
                                '<option value="27">27</option>' +
                                '<option value="28">28</option>' +
                                '<option value="29">29</option>' +
                                '<option value="30">30</option>' +
                                '<option value="31">31</option>' +
                                '<option value="32">32</option>' +
                                '<option value="33">33</option>' +
                                '<option value="23">23</option>' +
                                '<option value="34">34</option>' +
                                '<option value="35">35</option>' +
                                '<option value="36">36</option>' +
                                '<option value="37">37</option>' +
                                '<option value="38">38</option>' +
                                '<option value="39">39</option>' +
                                '<option value="40">40</option>' +
                                '<option value="41">41</option>' +
                                '<option value="42">42</option>' +
                                '<option value="43">43</option>' +
                                '<option value="44">44</option>' +
                                '<option value="45">45</option>' +
                                '<option value="46">46</option>' +
                                '<option value="47">47</option>' +
                                '<option value="48">48</option>' +
                                '<option value="49">49</option>' +
                                '<option value="50">50</option>' +
                                '<option value="51">51</option>' +
                                '<option value="52">52</option>' +
                                '<option value="53">53</option>' +
                                '<option value="54">54</option>' +
                                '<option value="55">55</option>' +
                                '<option value="56">56</option>' +
                                '<option value="57">57</option>' +
                                '<option value="58">58</option>' +
                                '<option value="59">59</option>' +
                                '</select>' +
                                '</td>',
                        '</tr>',
                        '</tbody>'
                    ],
                    months: [
                        '<tbody class="<%=className%>">',
                        '<tr>',
                        '<td colspan="2"><a href="#"><span><%=data[0]%></span></a></td>',
                        '<td colspan="2"><a href="#"><span><%=data[1]%></span></a></td>',
                        '<td colspan="2"><a href="#"><span><%=data[2]%></span></a></td>',
                        '<td colspan="2"><a href="#"><span><%=data[3]%></span></a></td>',
                        '</tr>',
                        '<tr>',
                        '<td colspan="2"><a href="#"><span><%=data[4]%></span></a></td>',
                        '<td colspan="2"><a href="#"><span><%=data[5]%></span></a></td>',
                        '<td colspan="2"><a href="#"><span><%=data[6]%></span></a></td>',
                        '<td colspan="2"><a href="#"><span><%=data[7]%></span></a></td>',
                        '</tr>',
                        '<tr>',
                        '<td colspan="2"><a href="#"><span><%=data[8]%></span></a></td>',
                        '<td colspan="2"><a href="#"><span><%=data[9]%></span></a></td>',
                        '<td colspan="2"><a href="#"><span><%=data[10]%></span></a></td>',
                        '<td colspan="2"><a href="#"><span><%=data[11]%></span></a></td>',
                        '</tr>',
                        '</tbody>'
                    ]
                },
                defaults = {
                    flat: false,
                    starts: 1,
                    prev: '&#9664;',
                    next: '&#9654;',
                    lastSel: false,
                    mode: 'single',
                    view: 'days',
                    calendars: 1,
                    format: 'Y-m-d',
                    position: 'bottom',
                    eventName: 'click',
                    onRender: function() {
                        return {};
                    },
                    onChange: function() {
                        return true;
                    },
                    onShow: function() {
                        return true;
                    },
                    onBeforeShow: function() {
                        return true;
                    },
                    onHide: function() {
                        return true;
                    },
                    locale: {
                        days: ["\u661F\u671F\u65E5", "\u661F\u671F\u4E00", "\u661F\u671F\u4E8C", "\u661F\u671F\u4E09", "\u661F\u671F\u56DB", "\u661F\u671F\u4E94", "\u661F\u671F\u516D", "\u661F\u671F\u65E5"],
                        daysShort: ["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D", "\u5468\u65E5"],
                        daysMin: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"],
                        months: ["\u4E00\u6708", "\u4E8C\u6708", "\u4E09\u6708", "\u56DB\u6708", "\u4E94\u6708", "\u516D\u6708", "\u4E03\u6708", "\u516B\u6708", "\u4E5D\u6708", "\u5341\u6708", "\u5341\u4E00\u6708", "\u5341\u4E8C\u6708"],
                        monthsShort: ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341", "\u5341\u4E00", "\u5341\u4E8C"],
                        weekMin: "\u5468"
                    }
                },
                fill = function(el) {
                    var isDelete = true;
                    var options = $(el).data('datepicker');
                    var cal = $(el);
                    var currentCal = Math.floor(options.calendars / 2), date, data, dow, month, cnt = 0, week, days, indic, indic2, html, tblCal;
                    cal.find('td>table tbody').remove();
                    if (isDelete) {
                        $("select[name='hour']").remove();// 在弹出双时间控件之前，清楚select相关的时分秒控件
                        $("select[name='minute']").remove();
                        $("select[name='second']").remove();
                        isDelete = false;
                    }
                    for (var i = 0; i < options.calendars; i++) {
                        date = new Date(options.current);
                        date.addMonths(-currentCal + i);
                        tblCal = cal.find('table').eq(i + 1);
                        switch (tblCal[0].className) {
                            case 'datepickerViewDays':
                                dow = formatDate(date, 'B, Y');
                                break;
                            case 'datepickerViewMonths':
                                dow = date.getFullYear();
                                break;
                            case 'datepickerViewYears':
                                dow = (date.getFullYear() - 6) + ' - ' + (date.getFullYear() + 5);
                                break;
                        }
                        tblCal.find('thead tr:first th:eq(1) span').text(dow);
                        dow = date.getFullYear() - 6;
                        data = {
                            data: [],
                            className: 'datepickerYears'
                        }
                        for (var j = 0; j < 12; j++) {
                            data.data.push(dow + j);
                        }
                        html = tmpl(tpl.months.join(''), data);
                        date.setDate(1);
                        data = {weeks:[], test: 10};
                        month = date.getMonth();
                        var dow = (date.getDay() - options.starts) % 7;
                        date.addDays(-(dow + (dow < 0 ? 7 : 0)));
                        week = -1;
                        cnt = 0;
                        while (cnt < 42) {
                            indic = parseInt(cnt / 7, 10);
                            indic2 = cnt % 7;
                            if (!data.weeks[indic]) {
                                week = date.getWeekNumber();
                                data.weeks[indic] = {
                                    week: week,
                                    days: []
                                };
                            }
                            data.weeks[indic].days[indic2] = {
                                text: date.getDate(),
                                classname: []
                            };
                            if (month != date.getMonth()) {
                                data.weeks[indic].days[indic2].classname.push('datepickerNotInMonth');
                            }
                            if (date.getDay() == 0) {
                                data.weeks[indic].days[indic2].classname.push('datepickerSunday');
                            }
                            if (date.getDay() == 6) {
                                data.weeks[indic].days[indic2].classname.push('datepickerSaturday');
                            }
                            var fromUser = options.onRender(date);
                            var val = date.valueOf();
                            if (fromUser.selected || options.date == val || $.inArray(val, options.date) > -1 || (options.mode == 'range' && val >= options.date[0] && val <= options.date[1])) {
                                data.weeks[indic].days[indic2].classname.push('datepickerSelected');
                            }
                            if (fromUser.disabled) {
                                data.weeks[indic].days[indic2].classname.push('datepickerDisabled');
                            }
                            if (fromUser.className) {
                                data.weeks[indic].days[indic2].classname.push(fromUser.className);
                            }
                            data.weeks[indic].days[indic2].classname = data.weeks[indic].days[indic2].classname.join(' ');
                            cnt++;
                            date.addDays(1);
                        }
                        html = tmpl(tpl.days.join(''), data) + html;
                        data = {
                            data: options.locale.monthsShort,
                            className: 'datepickerMonths'
                        };
                        html = tmpl(tpl.months.join(''), data) + html;
                        tblCal.append(html);
                    }
                },
                parseDate = function (date, format) {
                    if (date.constructor == Date) {
                        return new Date(date);
                    }
                    var parts = date.split(/\W+/);
                    var against = format.split(/\W+/), d, m, y, h, min, now = new Date();
                    for (var i = 0; i < parts.length; i++) {
                        switch (against[i]) {
                            case 'd':
                            case 'e':
                                d = parseInt(parts[i], 10);
                                break;
                            case 'm':
                                m = parseInt(parts[i], 10) - 1;
                                break;
                            case 'Y':
                            case 'y':
                                y = parseInt(parts[i], 10);
                                y += y > 100 ? 0 : (y < 29 ? 2000 : 1900);
                                break;
                            case 'H':
                            case 'I':
                            case 'k':
                            case 'l':
                                h = parseInt(parts[i], 10);
                                break;
                            case 'P':
                            case 'p':
                                if (/pm/i.test(parts[i]) && h < 12) {
                                    h += 12;
                                } else if (/am/i.test(parts[i]) && h >= 12) {
                                    h -= 12;
                                }
                                break;
                            case 'M':
                                min = parseInt(parts[i], 10);
                                break;
                        }
                    }
                    return new Date(
                            y === undefined ? now.getFullYear() : y,
                            m === undefined ? now.getMonth() : m,
                            d === undefined ? now.getDate() : d,
                            h === undefined ? now.getHours() : h,
                            min === undefined ? now.getMinutes() : min,
                            0
                            );
                },
                formatDate = function(date, format) {
                    var m = date.getMonth();
                    var d = date.getDate();
                    var y = date.getFullYear();
                    var wn = date.getWeekNumber();
                    var w = date.getDay();
                    var s = {};
                    var hr = date.getHours();
                    var pm = (hr >= 12);
                    var ir = (pm) ? (hr - 12) : hr;
                    var dy = date.getDayOfYear();
                    if (ir == 0) {
                        ir = 12;
                    }
                    var min = date.getMinutes();
                    var sec = date.getSeconds();
                    var parts = format.split(''), part;
                    for (var i = 0; i < parts.length; i++) {
                        part = parts[i];
                        switch (parts[i]) {
                            case 'a':
                                part = date.getDayName();
                                break;
                            case 'A':
                                part = date.getDayName(true);
                                break;
                            case 'b':
                                part = date.getMonthName();
                                break;
                            case 'B':
                                part = date.getMonthName(true);
                                break;
                            case 'C':
                                part = 1 + Math.floor(y / 100);
                                break;
                            case 'd':
                                part = (d < 10) ? ("0" + d) : d;
                                break;
                            case 'e':
                                part = d;
                                break;
                            case 'H':
                                part = (hr < 10) ? ("0" + hr) : hr;
                                break;
                            case 'I':
                                part = (ir < 10) ? ("0" + ir) : ir;
                                break;
                            case 'j':
                                part = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy;
                                break;
                            case 'k':
                                part = hr;
                                break;
                            case 'l':
                                part = ir;
                                break;
                            case 'm':
                                part = (m < 9) ? ("0" + (1 + m)) : (1 + m);
                                break;
                            case 'M':
                                part = (min < 10) ? ("0" + min) : min;
                                break;
                            case 'p':
                            case 'P':
                                part = pm ? "PM" : "AM";
                                break;
                            case 's':
                                part = Math.floor(date.getTime() / 1000);
                                break;
                            case 'S':
                                part = (sec < 10) ? ("0" + sec) : sec;
                                break;
                            case 'u':
                                part = w + 1;
                                break;
                            case 'w':
                                part = w;
                                break;
                            case 'y':
                                part = ('' + y).substr(2, 2);
                                break;
                            case 'Y':
                                part = y;
                                break;
                        }
                        parts[i] = part;
                    }
                    return parts.join('');
                },
                extendDate = function(options) {
                    if (Date.prototype.tempDate) {
                        return;
                    }
                    Date.prototype.tempDate = null;
                    Date.prototype.months = options.months;
                    Date.prototype.monthsShort = options.monthsShort;
                    Date.prototype.days = options.days;
                    Date.prototype.daysShort = options.daysShort;
                    Date.prototype.getMonthName = function(fullName) {
                        return this[fullName ? 'months' : 'monthsShort'][this.getMonth()];
                    };
                    Date.prototype.getDayName = function(fullName) {
                        return this[fullName ? 'days' : 'daysShort'][this.getDay()];
                    };
                    Date.prototype.addDays = function (n) {
                        this.setDate(this.getDate() + n);
                        this.tempDate = this.getDate();
                    };
                    Date.prototype.addMonths = function (n) {
                        if (this.tempDate == null) {
                            this.tempDate = this.getDate();
                        }
                        this.setDate(1);
                        this.setMonth(this.getMonth() + n);
                        this.setDate(Math.min(this.tempDate, this.getMaxDays()));
                    };
                    Date.prototype.addYears = function (n) {
                        if (this.tempDate == null) {
                            this.tempDate = this.getDate();
                        }
                        this.setDate(1);
                        this.setFullYear(this.getFullYear() + n);
                        this.setDate(Math.min(this.tempDate, this.getMaxDays()));
                    };
                    Date.prototype.getMaxDays = function() {
                        var tmpDate = new Date(Date.parse(this)),
                                d = 28, m;
                        m = tmpDate.getMonth();
                        d = 28;
                        while (tmpDate.getMonth() == m) {
                            d ++;
                            tmpDate.setDate(d);
                        }
                        return d - 1;
                    };
                    Date.prototype.getFirstDay = function() {
                        var tmpDate = new Date(Date.parse(this));
                        tmpDate.setDate(1);
                        return tmpDate.getDay();
                    };
                    Date.prototype.getWeekNumber = function() {
                        var tempDate = new Date(this);
                        tempDate.setDate(tempDate.getDate() - (tempDate.getDay() + 6) % 7 + 3);
                        var dms = tempDate.valueOf();
                        tempDate.setMonth(0);
                        tempDate.setDate(4);
                        return Math.round((dms - tempDate.valueOf()) / (604800000)) + 1;
                    };
                    Date.prototype.getDayOfYear = function() {
                        var now = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
                        var then = new Date(this.getFullYear(), 0, 0, 0, 0, 0);
                        var time = now - then;
                        return Math.floor(time / 24 * 60 * 60 * 1000);
                    };
                },
                layout = function (el) {
                    var options = $(el).data('datepicker');
                    var cal = $('#' + options.id);
                    if (!options.extraHeight) {
                        var divs = $(el).find('div');
                        options.extraHeight = divs.get(0).offsetHeight + divs.get(1).offsetHeight;
                        options.extraWidth = divs.get(2).offsetWidth + divs.get(3).offsetWidth;
                    }
                    var tbl = cal.find('table:first').get(0);
                    var width = tbl.offsetWidth;
                    var height = tbl.offsetHeight;
                    cal.css({
                        width: width + options.extraWidth + 'px',
                        height: height + options.extraHeight + 'px'
                    }).find('div.datepickerContainer').css({
                        width: width + 'px',
                        height: height + 'px'
                    });
                },
                click = function(ev) {
                    if ($(ev.target).is('span')) {
                        ev.target = ev.target.parentNode;
                    }
                    var el = $(ev.target);
                    if (el.is('a')) {
                        ev.target.blur();
                        if (el.hasClass('datepickerDisabled')) {
                            return false;
                        }
                        var options = $(this).data('datepicker');
                        var parentEl = el.parent();
                        var tblEl = parentEl.parent().parent().parent();
                        var tblIndex = $('table', this).index(tblEl.get(0)) - 1;
                        var tmp = new Date(options.current);
                        var changed = false;
                        var fillIt = false;
                        if (parentEl.is('th')) {
                            if (parentEl.hasClass('datepickerWeek') && options.mode == 'range' && !parentEl.next().hasClass('datepickerDisabled')) {
                                var val = parseInt(parentEl.next().text(), 10);
                                tmp.addMonths(tblIndex - Math.floor(options.calendars / 2));
                                if (parentEl.next().hasClass('datepickerNotInMonth')) {
                                    tmp.addMonths(val > 15 ? -1 : 1);
                                }
                                tmp.setDate(val);
                                var hour = 0;
                                var minute = 0;
                                var second = 0;
                                alert("select shu "+$("select[name='hour']").length);
                                $("select[name='hour']").each(function(i, o) {
                                    if (i == 0) {
                                        hour = $(o).val();
                                    }
                                });
                                $("select[name='minute']").each(function(i, o) {
                                    if (i == 0) {
                                        minute = $(o).val();
                                    }
                                });
                                $("select[name='second']").each(function(i, o) {
                                    if (i == 0) {
                                        second = $(o).val();
                                    }
                                });
                                options.date[0] = (tmp.setHours(hour, minute, second, 0)).valueOf();
                                $("select[name='hour']").each(function(i, o) {
                                    if (i == 1) {
                                        hour = $(o).val();
                                    }
                                });
                                $("select[name='minute']").each(function(i, o) {
                                    if (i == 1) {
                                        minute = $(o).val();
                                    }
                                });
                                $("select[name='second']").each(function(i, o) {
                                    if (i == 1) {
                                        second = $(o).val();
                                    }
                                });

                                tmp.setHours(hour, minute, second, 0);
                                tmp.addDays(6);

                                options.date[1] = tmp.valueOf();
                                fillIt = true;
                                changed = true;
                                options.lastSel = false;
                            } else if (parentEl.hasClass('datepickerMonth')) {
                                tmp.addMonths(tblIndex - Math.floor(options.calendars / 2));
                                switch (tblEl.get(0).className) {
                                    case 'datepickerViewDays':
                                        tblEl.get(0).className = 'datepickerViewMonths';
                                        el.find('span').text(tmp.getFullYear());
                                        break;
                                    case 'datepickerViewMonths':
                                        tblEl.get(0).className = 'datepickerViewYears';
                                        el.find('span').text((tmp.getFullYear() - 6) + ' - ' + (tmp.getFullYear() + 5));
                                        break;
                                    case 'datepickerViewYears':
                                        tblEl.get(0).className = 'datepickerViewDays';
                                        el.find('span').text(formatDate(tmp, 'B, Y'));
                                        break;
                                }
                            } else if (parentEl.parent().parent().is('thead')) {
                                switch (tblEl.get(0).className) {
                                    case 'datepickerViewDays':
                                        options.current.addMonths(parentEl.hasClass('datepickerGoPrev') ? -1 : 1);
                                        break;
                                    case 'datepickerViewMonths':
                                        options.current.addYears(parentEl.hasClass('datepickerGoPrev') ? -1 : 1);
                                        break;
                                    case 'datepickerViewYears':
                                        options.current.addYears(parentEl.hasClass('datepickerGoPrev') ? -12 : 12);
                                        break;
                                }
                                fillIt = true;
                            }
                        } else if (parentEl.is('td') && !parentEl.hasClass('datepickerDisabled')) {
                            switch (tblEl.get(0).className) {
                                case 'datepickerViewMonths':
                                    options.current.setMonth(tblEl.find('tbody.datepickerMonths td').index(parentEl));
                                    options.current.setFullYear(parseInt(tblEl.find('thead th.datepickerMonth span').text(), 10));
                                    options.current.addMonths(Math.floor(options.calendars / 2) - tblIndex);
                                    tblEl.get(0).className = 'datepickerViewDays';
                                    break;
                                case 'datepickerViewYears':
                                    options.current.setFullYear(parseInt(el.text(), 10));
                                    tblEl.get(0).className = 'datepickerViewMonths';
                                    break;
                                default:
                                    var val = parseInt(el.text(), 10);
                                    tmp.addMonths(tblIndex - Math.floor(options.calendars / 2));
                                    if (parentEl.hasClass('datepickerNotInMonth')) {
                                        tmp.addMonths(val > 15 ? -1 : 1);
                                    }
                                    tmp.setDate(val);
                                    switch (options.mode) {
                                        case 'multiple':
                                            alert('multiple');
                                            var hour = 0;
                                            var minute = 0;
                                            var second = 0;
                                            $("select[name='hour']").each(function(i, o) {
                                                if (i == 0) {
                                                    hour = $(o).val();
                                                }
                                            });
                                            $("select[name='minute']").each(function(i, o) {
                                                if (i == 0) {
                                                    minute = $(o).val();
                                                }
                                            });
                                            $("select[name='second']").each(function(i, o) {
                                                if (i == 0) {
                                                    second = $(o).val();
                                                }
                                            });
                                            val = (tmp.setHours(hour, minute, second, 0)).valueOf();
                                            if ($.inArray(val, options.date) > -1) {
                                                $.each(options.date, function(nr, dat) {
                                                    if (dat == val) {
                                                        options.date.splice(nr, 1);
                                                        return false;
                                                    }
                                                });
                                            } else {
                                                options.date.push(val);
                                            }
                                            break;
                                        case 'range':
                                            alert('range');
                                            var hour = 0;
                                            var minute = 0;
                                            var second = 0;
                                            if (!options.lastSel) {
                                                alert("不是第一个日期");
                                                $("select[name='hour']").each(function(i, o) {
                                                    if (i == 0) {
                                                        hour = $(o).val();

                                                    }
                                                });
                                                $("select[name='minute']").each(function(i, o) {
                                                    if (i == 0) {
                                                        minute = $(o).val();

                                                    }
                                                });
                                                $("select[name='second']").each(function(i, o) {
                                                    if (i == 0) {
                                                        second = $(o).val();

                                                    }
                                                });
                                                options.date[0] = (tmp.setHours(hour, minute, second, 0)).valueOf();
                                            }

                                            $("select[name='hour']").each(function(i, o) {
                                                if (i == 1) {
                                                    hour = $(o).val();
                                                }
                                            });
                                            $("select[name='minute']").each(function(i, o) {
                                                if (i == 1) {
                                                    minute = $(o).val();
                                                }
                                            });
                                            $("select[name='second']").each(function(i, o) {
                                                if (i == 1) {
                                                    second = $(o).val();
                                                }
                                            });
                                            val = (tmp.setHours(hour, minute, second, 0)).valueOf();
                                            if (val < options.date[0]) {
                                                options.date[1] = options.date[0] + 86399000;
                                                options.date[0] = val - 86399000;
                                            } else {
                                                options.date[1] = val;
                                            }
                                            options.lastSel = !options.lastSel;
                                            break;
                                        default:
                                            options.date = tmp.valueOf();
                                            break;
                                    }
                                    break;
                            }
                            fillIt = true;
                            changed = true;
                        }
                        if (fillIt) {
                            fill(this);
                        }
                        if (changed) {
                            options.onChange.apply(this, prepareDate(options));
                        }
                    }
                    return false;
                },
                prepareDate = function (options) {
                    var tmp;
                    if (options.mode == 'single') {
                        tmp = new Date(options.date);
                        return [formatDate(tmp, options.format), tmp, options.el];
                    } else {
                        tmp = [
                            [],
                            [],
                            options.el
                        ];
                        $.each(options.date, function(nr, val) {
                            var date = new Date(val);
                            tmp[0].push(formatDate(date, options.format));
                            tmp[1].push(date);
                        });
                        return tmp;
                    }
                },
                getViewport = function () {
                    var m = document.compatMode == 'CSS1Compat';
                    return {
                        l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
                        t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
                        w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
                        h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
                    };
                },
                isChildOf = function(parentEl, el, container) {
                    if (parentEl == el) {
                        return true;
                    }
                    if (parentEl.contains) {
                        return parentEl.contains(el);
                    }
                    if (parentEl.compareDocumentPosition) {
                        return !!(parentEl.compareDocumentPosition(el) & 16);
                    }
                    var prEl = el.parentNode;
                    while (prEl && prEl != container) {
                        if (prEl == parentEl)
                            return true;
                        prEl = prEl.parentNode;
                    }
                    return false;
                },
                show = function (ev) {
                    var cal = $('#' + $(this).data('datepickerId'));
                    if (!cal.is(':visible')) {
                        var calEl = cal.get(0);
                        fill(calEl);
                        var options = cal.data('datepicker');
                        options.onBeforeShow.apply(this, [cal.get(0)]);
                        var pos = $(this).offset();
                        var viewPort = getViewport();
                        var top = pos.top;
                        var left = pos.left;
                        var oldDisplay = $.curCSS(calEl, 'display');
                        cal.css({
                            visibility: 'hidden',
                            display: 'block'
                        });
                        layout(calEl);
                        switch (options.position) {
                            case 'top':
                                top -= calEl.offsetHeight;
                                break;
                            case 'left':
                                left -= calEl.offsetWidth;
                                break;
                            case 'right':
                                left += this.offsetWidth;
                                break;
                            case 'bottom':
                                top += this.offsetHeight;
                                break;
                        }
                        if (top + calEl.offsetHeight > viewPort.t + viewPort.h) {
                            top = pos.top - calEl.offsetHeight;
                        }
                        if (top < viewPort.t) {
                            top = pos.top + this.offsetHeight + calEl.offsetHeight;
                        }
                        if (left + calEl.offsetWidth > viewPort.l + viewPort.w) {
                            left = pos.left - calEl.offsetWidth;
                        }
                        if (left < viewPort.l) {
                            left = pos.left + this.offsetWidth
                        }
                        cal.css({
                            visibility: 'visible',
                            display: 'block',
                            top: top + 'px',
                            left: left + 'px'
                        });
                        if (options.onShow.apply(this, [cal.get(0)]) != false) {
                            cal.show();
                        }

                        //console.info(cal);

                        $(document).bind('mousedown', {cal: cal, trigger: this}, hide);
                    }
                    return false;
                },
                hide = function (ev) {
                    if (ev.target != ev.data.trigger && !isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
                        if (ev.data.cal.data('datepicker').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
                            ev.data.cal.hide();
                        }
                        $(document).unbind('mousedown', hide);
                    }
                };
        return {
            init: function(options) {
                options = $.extend({}, defaults, options || {});
                extendDate(options.locale);
                options.calendars = Math.max(1, parseInt(options.calendars, 10) || 1);
                options.mode = /single|multiple|range/.test(options.mode) ? options.mode : 'single';
                //console.info(options.date);
                return this.each(function() {
                    if (!$(this).data('datepicker')) {
                        options.el = this;
                        if (options.date.constructor == String) {
                            options.date = parseDate(options.date, options.format);
                            options.date.setHours(0, 0, 0, 0);
                        }
                        if (options.mode != 'single') {
                            if (options.date.constructor != Array) {
                                options.date = [options.date.valueOf()];
                                if (options.mode == 'range') {
                                    options.date.push(((new Date(options.date[0])).setHours(23, 59, 59, 0)).valueOf());
                                }
                            } else {
                                for (var i = 0; i < options.date.length; i++) {
                                    options.date[i] = (parseDate(options.date[i], options.format).setHours(0, 0, 0, 0)).valueOf();
                                }
                                if (options.mode == 'range') {
                                    options.date[1] = ((new Date(options.date[1])).setHours(23, 59, 59, 0)).valueOf();
                                }
                            }
                        } else {
                            options.date = options.date.valueOf();
                        }
                        if (!options.current) {
                            options.current = new Date();
                        } else {
                            options.current = parseDate(options.current, options.format);
                        }
                        options.current.setDate(1);
                        options.current.setHours(0, 0, 0, 0);
                        var id = 'datepicker_' + parseInt(Math.random() * 1000), cnt;
                        options.id = id;
                        $(this).data('datepickerId', options.id);
                        var cal = $(tpl.wrapper).attr('id', id).bind('click', click).data('datepicker', options);
                        if (options.className) {
                            cal.addClass(options.className);
                        }
                        var html = '';
                        for (var i = 0; i < options.calendars; i++) {
                            cnt = options.starts;
                            if (i > 0) {
                                html += tpl.space;
                            }
                            html += tmpl(tpl.head.join(''), {
                                week: options.locale.weekMin,
                                prev: options.prev,
                                next: options.next,
                                day1: options.locale.daysMin[(cnt++) % 7],
                                day2: options.locale.daysMin[(cnt++) % 7],
                                day3: options.locale.daysMin[(cnt++) % 7],
                                day4: options.locale.daysMin[(cnt++) % 7],
                                day5: options.locale.daysMin[(cnt++) % 7],
                                day6: options.locale.daysMin[(cnt++) % 7],
                                day7: options.locale.daysMin[(cnt++) % 7]
                            });
                        }
                        cal
                                .find('tr:first').append(html)
                                .find('table').addClass(views[options.view]);
                        fill(cal.get(0));
                        if (options.flat) {
                            cal.appendTo(this).show().css('position', 'relative');
                            layout(cal.get(0));
                        } else {
                            cal.appendTo(document.body);
                            $(this).bind(options.eventName, show);
                        }
                    }
                });
            },
            showPicker: function() {
                return this.each(function () {
                    if ($(this).data('datepickerId')) {
                        show.apply(this);
                    }
                });
            },
            hidePicker: function() {
                return this.each(function () {
                    if ($(this).data('datepickerId')) {
                        $('#' + $(this).data('datepickerId')).hide();
                    }
                });
            },
            setDate: function(date, shiftTo) {
                return this.each(function() {
                    if ($(this).data('datepickerId')) {
                        var cal = $('#' + $(this).data('datepickerId'));
                        var options = cal.data('datepicker');
                        options.date = date;
                        if (options.date.constructor == String) {
                            options.date = parseDate(options.date, options.format);
                            options.date.setHours(0, 0, 0, 0);
                        }
                        if (options.mode != 'single') {
                            if (options.date.constructor != Array) {
                                options.date = [options.date.valueOf()];
                                if (options.mode == 'range') {
                                    options.date.push(((new Date(options.date[0])).setHours(23, 59, 59, 0)).valueOf());
                                }
                            } else {
                                for (var i = 0; i < options.date.length; i++) {
                                    options.date[i] = (parseDate(options.date[i], options.format).setHours(0, 0, 0, 0)).valueOf();
                                }
                                if (options.mode == 'range') {
                                    options.date[1] = ((new Date(options.date[1])).setHours(23, 59, 59, 0)).valueOf();
                                }
                            }
                        } else {
                            options.date = options.date.valueOf();
                        }
                        if (shiftTo) {
                            options.current = new Date(options.mode != 'single' ? options.date[0] : options.date);
                        }
                        fill(cal.get(0));
                    }
                });
            },
            getDate: function(formated) {
                if (this.size() > 0) {
                    return prepareDate($('#' + $(this).data('datepickerId')).data('datepicker'))[formated ? 0 : 1];
                }
            },
            clear: function() {
                return this.each(function() {
                    if ($(this).data('datepickerId')) {
                        var cal = $('#' + $(this).data('datepickerId'));
                        var options = cal.data('datepicker');
                        if (options.mode != 'single') {
                            options.date = [];
                            fill(cal.get(0));
                        }
                    }
                });
            },
            fixLayout: function() {
                return this.each(function() {
                    if ($(this).data('datepickerId')) {
                        var cal = $('#' + $(this).data('datepickerId'));
                        var options = cal.data('datepicker');
                        if (options.flat) {
                            layout(cal.get(0));
                        }
                    }
                });
            }
        };
    }();
    $.fn.extend({
        DatePicker: DatePicker.init,
        DatePickerHide: DatePicker.hidePicker,
        DatePickerShow: DatePicker.showPicker,
        DatePickerSetDate: DatePicker.setDate,
        DatePickerGetDate: DatePicker.getDate,
        DatePickerClear: DatePicker.clear,
        DatePickerLayout: DatePicker.fixLayout
    });
})(jQuery);

(function() {
    this.tmpl = tmpl = (function (cache, $) {
        return function (str, data) {
            var fn = !/\s/.test(str)
                    ? cache[str] = cache[str]
                    || tmpl(document.getElementById(str).innerHTML)

                    : function (data) {
                var i, variable = [$], value = [
                    []
                ];
                for (i in data) {
                    variable.push(i);
                    value.push(data[i]);
                }
                ;
                return (new Function(variable, fn.$))
                        .apply(data, value).join("");
            };

            fn.$ = fn.$ || $ + ".push('"
                    + str.replace(/\\/g, "\\\\")
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join($ + ".push('")
                    .split("\r").join("\\'")
                    + "');return " + $;

            return data ? fn(data) : fn;
        }
    })({}, '$' + (+ new Date));
})();
