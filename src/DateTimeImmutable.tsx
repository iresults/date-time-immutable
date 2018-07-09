import * as moment from 'moment';
import {idFromMonth, Month, monthFromId} from './Month';

export type ModifyInputArgument1 = moment.Duration
    | number
    | string
    | moment.FromTo
    | moment.DurationInputObject
    | void;
export type ModifyInputArgument2 = moment.unitOfTime.DurationConstructor;
export type Moment = moment.Moment;
export type Diff = moment.unitOfTime.Diff;
export type StartOf = moment.unitOfTime.StartOf;

const cloneDate = (input: Date) => {
    return new Date(input.getTime());
};

/**
 * Immutable Date object inspired by PHP's DateTimeImmutable
 */
export class DateTimeImmutable {
    _moment?: Moment;
    _dateInstance: Date;

    constructor(input?: DateTimeImmutable | Moment | Date | string, format?: string) {
        if (arguments.length === 0) {
            this._dateInstance = new Date();
        } else if (input instanceof DateTimeImmutable) {
            this._dateInstance = new Date(input.timestamp);
        } else if (input instanceof Date) {
            this._dateInstance = cloneDate(input);
        } else if (moment.isMoment(input)) {
            const momentInstance = input.clone();
            this._dateInstance = momentInstance.toDate();
            this._moment = momentInstance;
        } else if (typeof input === 'string') {
            if (typeof format !== 'string') {
                format = 'YYYY-MM-DD HH:mm:ssZ';
            }

            const momentInstance = moment(input, format);
            this._dateInstance = momentInstance.toDate();
            this._moment = momentInstance;
        } else {
            throw new TypeError('Invalid input type ' + (typeof input));
        }

        if (isNaN(this._dateInstance.valueOf())) {
            throw new RangeError('Could not create a valid date');
        }
    }

    /**
     * Get the raw JavaScript Date version
     *
     * @return {Date}
     */
    get dateInstance(): Date {
        return cloneDate(this._dateInstance);
    }

    /**
     * Get the day of Month
     *
     * @returns {number}
     */
    get date(): number {
        return this._dateInstance.getDate();
    }

    /**
     * Get the Month
     *
     * @returns {Month}
     */
    get month(): Month {
        return monthFromId(this._dateInstance.getMonth());
    }

    /**
     * Get the JavaScript Month index
     *
     * @returns {number}
     */
    get monthId(): number {
        return this._dateInstance.getMonth();
    }

    /**
     * Get the Year
     *
     * @returns {number}
     */
    get year(): number {
        return this._dateInstance.getFullYear();
    }

    /**
     * Get the UNIX timestamp in milliseconds since 1970-01-01
     *
     * @returns {number}
     */
    get timestamp(): number {
        return this._dateInstance.valueOf();
    }

    /**
     * Get the ISO day of the week with 1 being Monday and 7 being Sunday
     *
     * @returns {number}
     */
    get isoWeekday(): number {
        const day = this._dateInstance.getDay();
        if (day === 0) {
            return 7;
        }

        return day;
    }

    /**
     * Get the day of the week, where 0 represents Sunday
     *
     *
     * @return {number}
     */
    get day(): number {
        return this._dateInstance.getDay();
    }

    /**
     * Return the UNIX timestamp in milliseconds since 1970-01-01
     *
     * @returns {number}
     */
    valueOf(): number {
        return this._dateInstance.valueOf();
    }

    /**
     * Render the date in the given format
     *
     * @link https://momentjs.com/docs/#/displaying/
     *
     * @param {string} format
     * @return string
     */
    format(format: string) {
        return this.getMomentInstance().format(format);
    }

    /**
     * Return the string representation of the date
     *
     * @return string
     */
    toString(): string {
        return this.getMomentInstance().toString();
    }

    /**
     * Return the string representation of the date
     *
     * @return string
     */
    toLocaleString(): string {
        return this.getMomentInstance().toLocaleString();
    }

    /**
     * Add the given time to the clone
     *
     * @see https://momentjs.com/docs/#/manipulating/add/
     * @param {ModifyInputArgument1} amount
     * @param {ModifyInputArgument2} unit
     * @returns {DateTimeImmutable}
     */
    add(amount?: ModifyInputArgument1, unit?: ModifyInputArgument2): DateTimeImmutable {
        let clone = this.getMomentInstance().clone();
        clone.add(amount, unit);

        return new DateTimeImmutable(clone);
    }

    /**
     * Subtract the given time from the clone
     *
     * @see https://momentjs.com/docs/#/manipulating/subtract/
     * @param {ModifyInputArgument1} amount
     * @param {ModifyInputArgument2} unit
     * @returns {DateTimeImmutable}
     */
    subtract(amount?: ModifyInputArgument1, unit?: ModifyInputArgument2): DateTimeImmutable {
        let clone = this.getMomentInstance().clone();
        clone.subtract(amount, unit);

        return new DateTimeImmutable(clone);
    }

    /**
     * Return the difference between `this` and `otherDate` in milliseconds or the specified `unitOfTime`
     * @param {DateTimeImmutable | Moment} otherDate
     * @param {Diff} unitOfTime
     * @returns {number}
     */
    diff(otherDate: DateTimeImmutable | Moment, unitOfTime?: Diff): number {
        if (otherDate instanceof DateTimeImmutable) {
            return this.diff(otherDate.getMomentInstance(), unitOfTime);
        }

        return this.getMomentInstance().diff(otherDate, unitOfTime);
    }

    /**
     * Check if a date is between two other dates
     *
     * @see https://momentjs.com/docs/#/query/is-between/
     * @param {DateTimeImmutable} from
     * @param {DateTimeImmutable} to
     * @param {StartOf} granularity
     * @param {"()" | "[)" | "(]" | "[]"} inclusivity
     * @returns {boolean}
     */
    isBetween(from: DateTimeImmutable,
              to: DateTimeImmutable,
              granularity?: StartOf,
              inclusivity?: '()' | '[)' | '(]' | '[]'): boolean {
        if (!(from instanceof DateTimeImmutable)) {
            throw new TypeError('Argument "from" must be an instance of DateTimeImmutable');
        }
        if (!(to instanceof DateTimeImmutable)) {
            throw new TypeError('Argument "from" must be an instance of DateTimeImmutable');
        }

        return this.getMomentInstance().isBetween(
            from.getMomentInstance(),
            to.getMomentInstance(),
            granularity,
            inclusivity
        );
    }

    /**
     * Check if a date is before another date
     *
     * @see https://momentjs.com/docs/#/query/is-before/
     * @param {DateTimeImmutable | Moment} otherDate
     * @param {StartOf} units
     * @return {boolean}
     */
    isBefore(otherDate: DateTimeImmutable | Moment, units?: StartOf): boolean {
        if (otherDate instanceof DateTimeImmutable) {
            return this.getMomentInstance().isBefore(otherDate.getMomentInstance(), units);
        }

        return this.getMomentInstance().isBefore(otherDate, units);
    }

    /**
     * Check if a date is after another date
     *
     * @see https://momentjs.com/docs/#/query/is-before/
     * @param {DateTimeImmutable | Moment} otherDate
     * @param {StartOf} units
     * @return {boolean}
     */
    isAfter(otherDate: DateTimeImmutable | Moment, units?: StartOf): boolean {
        if (otherDate instanceof DateTimeImmutable) {
            return this.getMomentInstance().isAfter(otherDate.getMomentInstance(), units);
        }

        return this.getMomentInstance().isAfter(otherDate, units);
    }

    /**
     * Return a clone with the given time
     *
     * A `RangeError` will be thrown if one of the arguments would overflow into the next unit.
     *
     * To allow overflows use `setTimeWithOverflow()`
     *
     * @param {number} hour
     * @param {number} minute
     * @param {number} second
     * @param {number} millisecond
     * @returns {DateTimeImmutable}
     */
    setTime(hour: number, minute?: number, second?: number, millisecond?: number): DateTimeImmutable {
        if (hour > 23) {
            throw new RangeError('Argument "hour" must not be bigger than 23');
        }
        if (minute !== undefined && minute > 59) {
            throw new RangeError('Argument "minute" must not be bigger than 59');
        }
        if (second !== undefined && second > 59) {
            throw new RangeError('Argument "second" must not be bigger than 59');
        }
        if (millisecond !== undefined && millisecond > 999) {
            throw new RangeError('Argument "millisecond" must not be bigger than 999');
        }

        return this.setTimeWithOverflow(hour, minute, second, millisecond);
    }

    /**
     * Return a clone with the given time with overflow
     *
     * If `minute` is 74 it will overflow to 1 hour and 14 minutes
     *
     * @param {number} hour
     * @param {number} minute
     * @param {number} second
     * @param {number} millisecond
     * @returns {DateTimeImmutable}
     */
    setTimeWithOverflow(hour: number, minute?: number, second?: number, millisecond?: number): DateTimeImmutable {
        let clone = cloneDate(this._dateInstance);

        if (hour !== clone.getHours()) {
            clone.setHours(hour);
        }
        if (undefined !== minute && minute !== clone.getMinutes()) {
            clone.setMinutes(minute);
        }
        if (undefined !== second && second !== clone.getSeconds()) {
            clone.setSeconds(second);
        }
        if (undefined !== millisecond && millisecond !== clone.getMilliseconds()) {
            clone.setMilliseconds(millisecond);
        }

        return new DateTimeImmutable(clone);
    }

    /**
     * Return a clone with the given date
     *
     * A `RangeError` will be thrown if `date` is bigger than the maximum number of days in the target month, or if
     * `date` is lower than 1.
     *
     * To allow overflows use `setDateWithOverflow()`
     *
     * @param {number} year
     * @param {Month} month
     * @param {number} date
     * @returns {DateTimeImmutable}
     */
    setDate(year: number, month: Month, date: number): DateTimeImmutable {
        if (date > this.determineDaysInMonth(month, year)) {
            throw new RangeError(`Day "${date}" would overflow into the next month`);
        }
        if (date < 1) {
            throw new RangeError(`Day must be bigger than zero`);
        }

        return this.setDateWithOverflow(year, idFromMonth(month), date);
    }

    /**
     * Return a clone with the given date with overflow
     *
     * If `monthId` is bigger than 11 the date will overflow to the following year(s).
     * If `date` is bigger than the month's number of days the date will overflow to the following month(s).
     *
     * @param {number} year
     * @param {number} monthId
     * @param {number} date
     * @returns {DateTimeImmutable}
     */
    setDateWithOverflow(year: number, monthId: number, date: number): DateTimeImmutable {
        let clone = cloneDate(this._dateInstance);

        if (year !== clone.getFullYear()) {
            clone.setFullYear(year);
        }
        if (monthId !== clone.getMonth()) {
            clone.setMonth(monthId);
        }
        if (date !== clone.getDate()) {
            clone.setDate(date);
        }

        return new DateTimeImmutable(clone);
    }

    /**
     * Return a clone of the Date
     *
     * @return {DateTimeImmutable}
     */
    clone(): DateTimeImmutable {
        return new DateTimeImmutable(this);
    }

    /**
     * Month is 1-indexed (January is 1, February is 2, etc).
     *
     * @param {Month} month
     * @param {number} year
     */
    private determineDaysInMonth(month: Month, year: number) {
        const monthId = idFromMonth(month);

        return new Date(year, monthId + 1, 0).getDate();
    }

    /**
     * Return the moment instance
     *
     * @return {moment.Moment}
     */
    private getMomentInstance() {
        if (!this._moment) {
            this._moment = moment(this._dateInstance);
        }
        return this._moment;
    }
}
