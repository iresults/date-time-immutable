import * as moment from 'moment';

type ModifyInputArgument1 = moment.Duration | number | string | moment.FromTo | moment.DurationInputObject | void;
type ModifyInputArgument2 = moment.unitOfTime.DurationConstructor;

export default class DateTimeImmutable {

    _moment: moment.Moment;

    constructor(input?: moment.Moment | Date | string, format?: string) {
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
     * Return the UNIX timestamp in milliseconds since 1970-01-01
     *
     * @returns {number}
     */
    getTimestamp(): number {
        return this._moment.valueOf();
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

    add(amount?: ModifyInputArgument1, unit?: ModifyInputArgument2): DateTimeImmutable {
        let clone = this._moment.clone();
        clone.add(amount, unit);

        return new DateTimeImmutable(clone);
    }

    subtract(amount?: ModifyInputArgument1, unit?: ModifyInputArgument2): DateTimeImmutable {
        let clone = this._moment.clone();
        clone.subtract(amount, unit);

        return new DateTimeImmutable(clone);
    }

    month(): number {
        return this._moment.month();
    }

    year(): number {
        return this._moment.year();
    }

    diff(otherDate: moment.Moment | this, units?: moment.unitOfTime.Diff): number {
        if (otherDate instanceof DateTimeImmutable) {
            return this.diff(otherDate._moment, units);
        }

        return this._moment.diff(otherDate, units);
    }

    /**
     * @param {DateTimeImmutable} from
     * @param {DateTimeImmutable} to
     * @param {moment.unitOfTime.StartOf} granularity
     * @param {"()" | "[)" | "(]" | "[]"} inclusivity
     * @returns {boolean}
     */
    isBetween(from: DateTimeImmutable,
              to: DateTimeImmutable,
              granularity?: moment.unitOfTime.StartOf,
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
     * @param {DateTimeImmutable} otherDate
     * @param {string|null} units
     * @return {boolean}
     */
    isBefore(otherDate: DateTimeImmutable, units?: string): boolean {
        if (otherDate instanceof DateTimeImmutable) {
            return this._moment.isBefore(otherDate._moment, units as any);
        }

        return this._moment.isBefore(otherDate, units as any);
    }

    /**
     * @param {number} hour
     * @param {number} minute
     * @param {number} second
     * @param {number} millisecond
     * @returns {DateTimeImmutable}
     */
    setTime(hour: number, minute?: number, second?: number, millisecond?: number): DateTimeImmutable {
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
     * @param {number} year
     * @param {number} month
     * @param {number} day
     * @returns {DateTimeImmutable}
     */
    setDate(year: number, month: number, day: number): DateTimeImmutable {
        let clone = this._moment.clone();

        clone.year(year);
        clone.month(month);
        clone.date(day);

        return new DateTimeImmutable(clone);
    }

    /**
     * @param {number} days
     * @return {DateTimeImmutable}
     */
    addWeekdays(days: number) {
        let date = this._moment.clone();
        while (days > 0) {
            date = date.add(1, 'days');
            // decrease "days" only if it's a weekday.
            if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
                days -= 1;
            }
        }

        const newDate = new DateTimeImmutable(date);

        // To align the behaviour with PHP's DateTimeImmutable we set the time to 00:00:00
        return newDate.setTime(0, 0, 0, 0);
    }

    /**
     * @param {number} days
     * @return {DateTimeImmutable}
     */
    addWorkingDays(days: number) {
        let date = this._moment.clone();
        while (days > 0) {
            date = date.add(1, 'days');
            // decrease "days" only if it's a weekday.
            if (date.isoWeekday() !== 7) {
                days -= 1;
            }
        }

        const newDate = new DateTimeImmutable(date);

        // To align the behaviour with PHP's DateTimeImmutable we set the time to 00:00:00
        return newDate.setTime(0, 0, 0, 0);
    }

    isoWeekday() {
        return this._moment.isoWeekday();
    }
}
