import DateTimeImmutable from './DateTimeImmutable';
import Month, {idFromMonth} from './Month';

const testDate = '2018-03-16';
const testTime = '14:58:03.200';
const testInstance = new DateTimeImmutable(testDate + ' ' + testTime, 'YYYY-MM-DD HH:mm:ss.SSS');

it('new', () => {
    // Ignore milliseconds for this comparison
    expect(
        (new DateTimeImmutable()).format('YYYY-MM-DD HH:mm:ss')
    ).toEqual(
        (new DateTimeImmutable()).format('YYYY-MM-DD HH:mm:ss')
    );

    expect(testInstance).toEqual(new DateTimeImmutable('2018-03-16 14:58:03.200', 'YYYY-MM-DD HH:mm:ss.SSS'));

    // Default time is 12am 0 minutes 0 seconds
    expect(
        new DateTimeImmutable('2018-03-16').format('YYYY-MM-DD HH:mm:ss.SSS Z')
    ).toEqual(
        new DateTimeImmutable('2018-03-16 00:00:00.000', 'YYYY-MM-DD HH:mm:ss.SSS').format('YYYY-MM-DD HH:mm:ss.SSS Z')
    );
});

it('date', () => {
    expect(testInstance.date).toBe(16);
});
it('month', () => {
    expect(testInstance.month).toBe(Month.March);
});
it('monthId', () => {
    expect(testInstance.monthId).toBe(2);
});
it('year', () => {
    expect(testInstance.year).toBe(2018);
});
it('timestamp', () => {
    expect(testInstance.timestamp).toBe(1521208683200);
});
it('isoWeekday', () => {
    expect(testInstance.isoWeekday).toBe(5);
});

it('setDate', () => {
    expect(
        testInstance.setDate(2018, Month.March, 15).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-15 ' + testTime);
    expect(
        testInstance.setDate(2018, Month.November, 15).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-11-15 ' + testTime);
    expect(
        testInstance.setDate(1802, Month.November, 15).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1802-11-15 ' + testTime);

    expect(() => {
        testInstance.setDate(1802, Month.November, -1);
    }).toThrowError('Day must be bigger than zero');
    expect(() => {
        testInstance.setDate(1802, Month.November, 0);
    }).toThrowError('Day must be bigger than zero');
    expect(() => {
        testInstance.setDate(1802, Month.November, 31);
    }).toThrowError('Day "31" would overflow into the next month');
    expect(() => {
        testInstance.setDate(1802, Month.November, 32);
    }).toThrowError('Day "32" would overflow into the next month');

    // Respect number of days in month
    expect(
        testInstance.setDate(1905, Month.July, 31).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1905-07-31 ' + testTime);
    expect(() => {
        testInstance.setDate(1905, Month.July, 32);
    }).toThrowError('Day "32" would overflow into the next month');

    expect(
        testInstance.setDate(1905, Month.February, 28).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1905-02-28 ' + testTime);
    expect(() => {
        testInstance.setDate(1905, Month.February, 29);
    }).toThrowError('Day "29" would overflow into the next month');

    // Respect leap years
    expect(
        testInstance.setDate(1904, Month.February, 29).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1904-02-29 ' + testTime);
    expect(() => {
        testInstance.setDate(1904, Month.February, 30);
    }).toThrowError('Day "30" would overflow into the next month');
});

it('setDateWithOverflow', () => {
    expect(
        testInstance.setDateWithOverflow(2018, idFromMonth(Month.March), 15).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-15 ' + testTime);
    expect(
        testInstance.setDateWithOverflow(2018, idFromMonth(Month.November), 15).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-11-15 ' + testTime);
    expect(
        testInstance.setDateWithOverflow(1802, idFromMonth(Month.November), 15).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1802-11-15 ' + testTime);

    expect(
        testInstance.setDateWithOverflow(1802, idFromMonth(Month.November), -1).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1802-10-30 ' + testTime);
    expect(
        testInstance.setDateWithOverflow(1802, idFromMonth(Month.November), 0).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1802-10-31 ' + testTime);
    expect(
        testInstance.setDateWithOverflow(1802, idFromMonth(Month.November), 32).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1802-12-02 ' + testTime);

    // Respect number of days in month
    expect(
        testInstance.setDateWithOverflow(1905, idFromMonth(Month.July), 31).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1905-07-31 ' + testTime);
    expect(
        testInstance.setDateWithOverflow(1905, idFromMonth(Month.July), 32).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1905-08-01 ' + testTime);

    expect(
        testInstance.setDateWithOverflow(1905, idFromMonth(Month.February), 28).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1905-02-28 ' + testTime);
    expect(
        testInstance.setDateWithOverflow(1905, idFromMonth(Month.February), 29).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1905-03-01 ' + testTime);

    // Respect leap years
    expect(
        testInstance.setDateWithOverflow(1904, idFromMonth(Month.February), 29).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1904-02-29 ' + testTime);
    expect(
        testInstance.setDateWithOverflow(1904, idFromMonth(Month.February), 30).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('1904-03-01 ' + testTime);
});

it('setTime', () => {
    const instance = new DateTimeImmutable('2018-03-16 00:00:00.000');

    expect(instance.setTime(23, 47, 2, 943).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2018-03-16 23:47:02.943');
    expect(instance.setTime(9, 47, 2, 943).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2018-03-16 09:47:02.943');
    expect(instance.setTime(23, 47, 2).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2018-03-16 23:47:02.000');
    expect(instance.setTime(9, 47, 2).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2018-03-16 09:47:02.000');
    expect(instance.setTime(23, 47).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2018-03-16 23:47:00.000');
    expect(instance.setTime(9, 47).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2018-03-16 09:47:00.000');
    expect(instance.setTime(23).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2018-03-16 23:00:00.000');
    expect(instance.setTime(9).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2018-03-16 09:00:00.000');
    expect(instance.setTime(23, 59, 59, 999).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2018-03-16 23:59:59.999');

    expect(() => {
        instance.setTime(23, 47, 2, 1000);
    }).toThrowError('Argument "millisecond" must not be bigger than 999');
    expect(() => {
        instance.setTime(23, 47, 60);
    }).toThrowError('Argument "second" must not be bigger than 59');
    expect(() => {
        instance.setTime(23, 60);
    }).toThrowError('Argument "minute" must not be bigger than 59');
    expect(() => {
        instance.setTime(24);
    }).toThrowError('Argument "hour" must not be bigger than 23');
});

it('setTimeWithOverflow', () => {
    const instance = new DateTimeImmutable('2018-03-16 00:00:00.000');

    expect(
        instance.setTimeWithOverflow(23, 47, 2, 943).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 23:47:02.943');
    expect(
        instance.setTimeWithOverflow(9, 47, 2, 943).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 09:47:02.943');
    expect(
        instance.setTimeWithOverflow(23, 47, 2).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 23:47:02.000');
    expect(
        instance.setTimeWithOverflow(9, 47, 2).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 09:47:02.000');
    expect(
        instance.setTimeWithOverflow(23, 47).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 23:47:00.000');
    expect(
        instance.setTimeWithOverflow(9, 47).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 09:47:00.000');
    expect(
        instance.setTimeWithOverflow(23).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 23:00:00.000');
    expect(
        instance.setTimeWithOverflow(9).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 09:00:00.000');
    expect(
        instance.setTimeWithOverflow(23, 59, 59, 999).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 23:59:59.999');

    expect(
        instance.setTimeWithOverflow(24, 59, 59, 999).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-17 00:59:59.999');
    expect(
        instance.setTimeWithOverflow(25, 59, 59, 999).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-17 01:59:59.999');
    expect(
        instance.setTimeWithOverflow(0, 62, 59, 999).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 01:02:59.999');
    expect(
        instance.setTimeWithOverflow(0, 0, 65, 999).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 00:01:05.999');
    expect(
        instance.setTimeWithOverflow(0, 59, 65, 999).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 01:00:05.999');
    expect(
        instance.setTimeWithOverflow(0, 0, 0, 1000).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 00:00:01.000');
    expect(
        instance.setTimeWithOverflow(0, 0, 59, 1000).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 00:01:00.000');
    expect(
        instance.setTimeWithOverflow(0, 59, 59, 1000).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-16 01:00:00.000');
    expect(
        instance.setTimeWithOverflow(23, 59, 59, 1000).format('YYYY-MM-DD HH:mm:ss.SSS')
    ).toBe('2018-03-17 00:00:00.000');
});
