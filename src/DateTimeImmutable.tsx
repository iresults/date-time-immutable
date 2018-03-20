import * as moment from 'moment';
import Month, {idFromMonth, monthFromId} from './Month';

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

/**
 * Immutable Date object inspired by PHP's DateTimeImmutable
 */
export default class DateTimeImmutable {

    _moment: Moment;

    constructor(input?: Moment | Date | string, format?: string) {
        if (arguments.length === 0) {
            this._moment = moment();
        } else if (input instanceof Date) {
            this._moment = moment(input);
        } else if (moment.isMoment(input)) {
            this._moment = input.clone();
        } else if (typeof input === 'string') {
            if (typeof format !== 'string') {
                format = 'YYYY-MM-DD HH:mm:ssZ';
            }

            this._moment = moment(input, format);
        } else {
            throw new TypeError('Invalid input type ' + (typeof input));
        }

        if (!this._moment.isValid()) {
            throw new RangeError('Could not create a valid date');
        }
    }

    /**
     * Get the day of Month
     *
     * @returns {number}
     */
    get date(): number {
        return this._moment.date();
    }

    /**
     * Get the Month
     *
     * @returns {Month}
     */
    get month(): Month {
        return monthFromId(this._moment.month());
    }

    /**
     * Get the JavaScript Month index
     *
     * @returns {number}
     */
    get monthId(): number {
        return this._moment.month();
    }

    /**
     * Get the Year
     *
     * @returns {number}
     */
    get year(): number {
        return this._moment.year();
    }

    /**
     * Get the UNIX timestamp in milliseconds since 1970-01-01
     *
     * @returns {number}
     */
    get timestamp(): number {
        return this._moment.valueOf();
    }

    /**
     * Get the ISO day of the week with 1 being Monday and 7 being Sunday
     *
     * @returns {number}
     */
    get isoWeekday(): number {
        return this._moment.isoWeekday();
    }

    /**
     * Return the UNIX timestamp in milliseconds since 1970-01-01
     *
     * @returns {number}
     */
    valueOf(): number {
        return this._moment.valueOf();
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
        return this._moment.format(format);
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
        let clone = this._moment.clone();
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
        let clone = this._moment.clone();
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
            return this.diff(otherDate._moment, unitOfTime);
        }

        return this._moment.diff(otherDate, unitOfTime);
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

        return this._moment.isBetween(from._moment, to._moment, granularity, inclusivity);
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
            return this._moment.isBefore(otherDate._moment, units);
        }

        return this._moment.isBefore(otherDate, units);
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
            return this._moment.isAfter(otherDate._moment, units);
        }

        return this._moment.isAfter(otherDate, units);
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
        let clone = this._moment.clone();

        clone.hour(hour);
        if (undefined !== minute) {
            clone.minute(minute);
        }
        if (undefined !== second) {
            clone.second(second);
        }
        if (undefined !== millisecond) {
            clone.millisecond(millisecond);
        }

        return new DateTimeImmutable(clone);
    }

    /**
     * Return a clone with the given date
     *
     * A `RangeError` will be thrown if `day` is bigger than the maximum number of days in the target month, or if `day`
     * is lower than 1.
     *
     * To allow overflows use `setDateWithOverflow()`
     *
     * @param {number} year
     * @param {Month} month
     * @param {number} day
     * @returns {DateTimeImmutable}
     */
    setDate(year: number, month: Month, day: number): DateTimeImmutable {
        if (day > this.determineDaysInMonth(month, year)) {
            throw new RangeError(`Day "${day}" would overflow into the next month`);
        }
        if (day < 1) {
            throw new RangeError(`Day must be bigger than zero`);
        }

        return this.setDateWithOverflow(year, idFromMonth(month), day);
    }

    /**
     * Return a clone with the given date with overflow
     *
     * If `monthId` is bigger than 11 the date will overflow to the following year(s).
     * If `day` is bigger than the month's number of days the date will overflow to the following month(s).
     *
     * @param {number} year
     * @param {number} monthId
     * @param {number} day
     * @returns {DateTimeImmutable}
     */
    setDateWithOverflow(year: number, monthId: number, day: number): DateTimeImmutable {
        let clone = this._moment.clone();

        clone.year(year);
        clone.month(monthId);
        clone.date(day);

        return new DateTimeImmutable(clone);
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
}
