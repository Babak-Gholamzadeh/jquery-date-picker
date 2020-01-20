; (function ($) {
    $.fn.datePicker = function (options) {
        var parentHTML = $(this);
        // options = $.extend(options, {
        //     parentHTML: parentHTML
        // });
        var datePicker = new DatePickerComponent({
            parentHTML: parentHTML,
            dateInput: '2020-11-30'
        });
        parentHTML.append(datePicker.render());
    }

    function DatePickerComponent(props) {
        (function constructor(props) {
            this.props = props || {};
            destructDate.call(this);
            // this.props.year = 2019;
            // this.props.month = 5;
            // this.props.day = 23;
        }).call(this, props);
        function destructDate() {
            var date = this.props.dateInput ? new Date(this.props.dateInput) : new Date();
            this.props.year = date.getFullYear();
            this.props.month = date.getMonth() + 1;
            this.props.day = date.getDate();
        }
        this.updateDays = function (newProps) {
            console.log('this:', this);
            console.log('newProps:', newProps);
            this.props.year = newProps.selectedYear || this.props.year;
            this.props.month = newProps.selectedMonth || this.props.month;
            var days = new DaysComponent({
                year: this.props.year,
                month: this.props.month
            });
            this.props.parentHTML.find('.days').remove();
            this.props.parentHTML.find('.date-section').append(days.render());
        }
        this.render = function () {
            var years = new YearsComponent({
                selectedYear: this.props.year,
                updateDays: this.updateDays.bind(this)
            });
            var months = new MonthsComponent({
                selectedMonth: this.props.month,
                updateDays: this.updateDays.bind(this)
            });
            var days = new DaysComponent({
                year: this.props.year,
                month: this.props.month,
                selectedDay: this.props.day
            });
            var button = new ButtonComponent();
            var time = new TimeComponent();
            var HTMLComponent = document.createRange().createContextualFragment(`
                <div class="date-picker-container show">
                    <div class="date-picker-wrapper">
                        <div class="top-section">
                            <div class="date-section">
                            </div>
                        </div>
                        <div class="bottom-section">
                        </div>
                    </div>
                </div>
            `);
            var dateSection = new DocumentFragment();
            dateSection.appendChild(years.render());
            dateSection.appendChild(months.render());
            dateSection.appendChild(days.render());
            var buttomSection = new DocumentFragment();
            buttomSection.appendChild(button.render());
            buttomSection.appendChild(time.render());

            HTMLComponent.querySelector('.date-section').appendChild(dateSection);
            HTMLComponent.querySelector('.bottom-section').appendChild(buttomSection);

            return HTMLComponent;
        }
    }
    function ButtonComponent(props) {
        (function constructor(props) {
            this.props = props;
        }).call(this, props);
        this.render = function () {
            return document.createRange().createContextualFragment(`
                <div class="button-section">
                    <button>DONE</button>
                </div>
            `);
        }
    }
    function TimeComponent(props) {
        (function constructor(props) {
            this.props = props;
        }).call(this, props);
        this.render = function () {
            var HTMLComponent = document.createRange().createContextualFragment(`
                <div class="time-section">
                    <div class="clock">
                        <div class="hours">
                            <ul class="digit0-list">
                            </ul>
                            <ul class="digit1-list">
                            </ul>
                        </div>
                        <div class="minutes">
                            <ul class="digit0-list">
                            </ul>
                            <ul class="digit1-list">
                            </ul>
                        </div>
                    </div>
                </div>
            `);
            var hoursDigit1 = new DocumentFragment();
            for(var hd1 = 0; hd1 < 2) {
                var digitTimeComponent = new DigitTimeComponent({
                    itemIndex: hd1,
                        
                });
                hoursDigit1.appendChild()
            }
            HTMLComponent.querySelector('.hours .digit0-list').appendChild()
            return HTMLComponent;
        }
    }
    function DigitTimeComponent(props) {
        (function constructor(props) {
            this.props = props;
        }).call(this, props);
        this.render = function () {
            var HTMLComponent = document.createRange().createContextualFragment(`
                <li style="--item-index: ${this.props.itemIndex};">
                    ${this.props.digit}
                </li>
            `);
            return HTMLComponent;
        }
    }
    function DaysComponent(props) {
        (function constructor(props) {
            this.props = props || {};
            // this.props.year = 2020;
            // this.props.month = 2;
            // this.props.selectedDay = 2;
            computeDaysStuff.call(this);
            this.normilizeThreshold = normilizeItemThreshold.call(this, 0, this.props.daysOfMonth - 7);
            this.props.itemThreshold = this.normilizeThreshold(this.props.selectedDay - 4);
        }).call(this, props);
        function fixNumberCharacters(num) {
            return '00'.substr(num.toString().length) + num;
        }
        function getWeekDay(index) {
            return ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'][index % 7];
        }
        function getDaysCount(year, monthIndex) {
            return [31, (year % 4) ? 28 : 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthIndex - 1];
        }
        function computeDaysStuff() {
            this.props.selectedDay = this.props.selectedDay || 1;
            this.props.daysOfMonth = getDaysCount(this.props.year, this.props.month);
            var date = new Date(`${this.props.year}-${this.props.month}-${01}`);
            this.props.weekDaysThreshold = date.getDay();
        }
        function selectDay(e) {
            var list = e.currentTarget;
            var item = e.target;
            this.props.selectedDay = +item.innerText;
            list.querySelector('.selected') && list.querySelector('.selected').classList.remove('selected');
            item.classList.add('selected');
            console.log('select day call');
        }
        this.updateItemThreshold = function (nextThreshold) {
            this.props.itemThreshold = nextThreshold;
            console.log('day change');
        }
        this.render = function () {
            var HTMLComponent = document.createRange().createContextualFragment(`
                <div class="days">
                    <ul class="days-list" style="--item-threshold: ${this.props.itemThreshold}">
                        ${
                (function () {
                    var list = [];
                    for (var i = 0; i < this.props.daysOfMonth; i++) {
                        var weekDayName = getWeekDay(i + this.props.weekDaysThreshold);
                        var classList = [];
                        if (['su', 'sa'].indexOf(weekDayName) + 1) classList.push('holiday');
                        if (i + 1 == this.props.selectedDay) classList.push('selected');
                        list.push(`
                                                    <li
                                                        data-week="${weekDayName}"
                                                        class="${classList.join(' ')}"
                                                        style="--item-index: ${i};"
                                                    >
                                                        ${fixNumberCharacters(i + 1)}
                                                    </li>
                                                `);
                    }
                    return list.join('');
                }).call(this)
                }
                    </ul>
                </div>
            `);
            HTMLComponent.querySelector('.days-list').addEventListener('wheel', listScrolling.bind(this));
            HTMLComponent.querySelector('.days-list').addEventListener('click', selectDay.bind(this));
            return HTMLComponent;
        }
    }
    function MonthsComponent(props) {
        (function constructor(props) {
            this.props = props || {};
            this.normilizeThreshold = normilizeItemThreshold.call(this, 0, 7);
            // this.props.selectedMonth = 1;
            this.props.itemThreshold = this.normilizeThreshold(this.props.selectedMonth - 3);
        }).call(this, props);
        var months = [
            'jan', 'feb', 'mar',
            'apr', 'may', 'jun',
            'jul', 'aug', 'sep',
            'oct', 'nov', 'dec'
        ];
        function selectMonth(e) {
            var list = e.currentTarget;
            var item = e.target;
            console.log('item.innerText:', item.innerText);
            this.props.selectedMonth = getMonthIndex(item.innerText);
            list.querySelector('.selected') && list.querySelector('.selected').classList.remove('selected');
            item.classList.add('selected');
            console.log('select month call');
            this.props.updateDays({
                selectedMonth: this.props.selectedMonth
            });
        }
        function getMonthIndex(monthName) {
            return {
                'jan': 1, 'feb': 2, 'mar': 3,
                'apr': 4, 'may': 5, 'jun': 6,
                'jul': 7, 'aug': 8, 'sep': 9,
                'oct': 10, 'nov': 11, 'dec': 12
            }[monthName.toLowerCase()];
        }
        this.updateItemThreshold = function (nextThreshold) {
            this.props.itemThreshold = nextThreshold;
            console.log('month change');
        }
        this.render = function () {
            var HTMLComponent = document.createRange().createContextualFragment(`
                <div class="months">
                    <ul class="months-list" style="--item-threshold: ${this.props.itemThreshold}">
                        ${
                months.map(function (month, index) {
                    return `
                                    <li
                                        ${index == this.props.selectedMonth - 1 ? `class="selected"` : null}
                                        style="--item-index: ${index};"
                                    >
                                        ${month}
                                    </li>`;
                }.bind(this)).join('')
                }
                    </ul>
                </div>
            `);
            HTMLComponent.querySelector('.months-list').addEventListener('wheel', listScrolling.bind(this));
            HTMLComponent.querySelector('.months-list').addEventListener('click', selectMonth.bind(this));
            return HTMLComponent;
        }
    }
    function YearsComponent(props) {
        (function constructor(props) {
            this.props = props || {};
            this.props.yearRange = 7;
            this.props.startRangeIndex = -Math.floor(this.props.yearRange / 2);
            this.props.endRangeIndex = Math.ceil(this.props.yearRange / 2);
            this.normilizeThreshold = normilizeItemThreshold.call(this, this.props.startRangeIndex, this.props.endRangeIndex - 3);
            // this.props.selectedYear = 2020;
            this.props.itemThreshold = -1;
            this.props.years = [];
            this.years = {};
            console.log('start:', [this.props.itemThreshold, this.props.startRangeIndex, this.props.endRangeIndex]);
            console.log('selected year:', this.props.selectedYear);
        }).call(this, props);
        function selectYear(e) {
            var list = e.currentTarget;
            var item = e.target;
            this.props.selectedYear = +item.innerText;
            list.querySelector('.selected') && list.querySelector('.selected').classList.remove('selected');
            item.classList.add('selected');
            console.log('select year call');
            this.props.updateDays({
                selectedYear: this.props.selectedYear
            });
        }
        this.generateYears = function (middleYear) {
            this.props.years = [];
            for (
                var y = middleYear - Math.floor(this.props.yearRange / 2);
                y < middleYear + Math.ceil(this.props.yearRange / 2);
                y++
            ) {
                this.props.years.push(y);
            }
        }
        this.leftShiftYears = function () {
            var firstYear = this.props.years[0];
            this.props.years.pop();
            this.props.years.unshift(firstYear - 1);
            this.props.startRangeIndex--;
            this.props.endRangeIndex--;
            this.normilizeThreshold = normilizeItemThreshold.call(this, this.props.startRangeIndex, this.props.endRangeIndex - 3);
        }
        this.rightShiftYears = function () {
            var lastYear = this.props.years[this.props.years.length - 1];
            this.props.years.shift();
            this.props.years.push(lastYear + 1);
            this.props.startRangeIndex++;
            this.props.endRangeIndex++;
            this.normilizeThreshold = normilizeItemThreshold.call(this, this.props.startRangeIndex, this.props.endRangeIndex - 3);
        }
        this.updateItemThreshold = function (nextThreshold, mountedComponent) {
            this.props.itemThreshold = nextThreshold;
            console.log('before:', [this.props.itemThreshold, this.props.startRangeIndex, this.props.endRangeIndex]);
            if (this.props.itemThreshold == this.props.startRangeIndex + 1) {
                mountedComponent.children[
                    this.props.yearRange - 1
                ].remove();
                this.leftShiftYears();
                var firstChildYear = new ChildYearComponent({
                    year: this.props.years[0],
                    selectedYear: this.props.selectedYear,
                    itemIndex: this.props.startRangeIndex
                });
                mountedComponent.insertBefore(firstChildYear.render(), mountedComponent.childNodes[0]);
            }
            else if (this.props.itemThreshold == this.props.endRangeIndex - 4) {
                mountedComponent.children[0].remove();
                this.rightShiftYears();
                var lastChildYear = new ChildYearComponent({
                    year: this.props.years[this.props.yearRange - 1],
                    selectedYear: this.props.selectedYear,
                    itemIndex: this.props.endRangeIndex - 1
                });
                mountedComponent.appendChild(lastChildYear.render());
            }
            console.log('after:', [this.props.itemThreshold, this.props.startRangeIndex, this.props.endRangeIndex]);
        }
        this.render = function () {
            var HTMLComponent = document.createRange().createContextualFragment(`
                <div class="years">
                    <ul
                        class="years-list"
                        style="--item-threshold: ${this.props.itemThreshold}"
                    >
                    </ul>
                </div>
            `);
            this.generateYears(this.props.selectedYear);
            for (
                var itemIndex = this.props.startRangeIndex,
                childIndex = 0;
                itemIndex < this.props.endRangeIndex,
                childIndex < this.props.yearRange;
                itemIndex++ ,
                childIndex++
            ) {
                console.log('year:', this.props.years[childIndex]);
                var childYear = new ChildYearComponent({
                    year: this.props.years[childIndex],
                    selectedYear: this.props.selectedYear,
                    itemIndex: itemIndex
                });
                HTMLComponent.querySelector('.years-list').appendChild(childYear.render());
            }
            HTMLComponent.querySelector('.years-list').addEventListener('wheel', listScrolling.bind(this));
            HTMLComponent.querySelector('.years-list').addEventListener('click', selectYear.bind(this));
            return HTMLComponent;
        }
    }
    function ChildYearComponent(props) {
        (function constructor(props) {
            this.props = props || {};
        }).call(this, props);
        this.render = function () {
            var HTMLComponent = document.createRange().createContextualFragment(`
                <li
                    ${this.props.year == this.props.selectedYear ? `class="selected"` : ``}
                    style="--item-index: ${this.props.itemIndex};"
                >
                    ${this.props.year}
                </li>
            `);
            return HTMLComponent;
        }
    }

    function listScrolling(e) {
        var direction = 1;
        if (e.deltaY > 0) direction = -1;
        var nextThreshold = this.normilizeThreshold(this.props.itemThreshold + direction);
        if (nextThreshold != this.props.itemThreshold) {
            this.updateItemThreshold(nextThreshold, e.currentTarget);
            e.currentTarget.style.setProperty('--item-threshold', nextThreshold);
        }
        // e.stopPropagation();
    }
    function normilizeItemThreshold(beginOfRange, endOfRange) {
        console.log('beginOfRange:', beginOfRange, 'endOfRange:', endOfRange);
        return function (threshold) {
            if (threshold < beginOfRange) threshold = beginOfRange;
            if (threshold > endOfRange) threshold = endOfRange;
            return threshold;
        }
    }

})(jQuery);