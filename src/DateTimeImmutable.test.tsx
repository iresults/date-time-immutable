import DateTimeImmutable from './DateTimeImmutable';

it('new', () => {
    expect(new DateTimeImmutable('2018-03-16')).toBe(new DateTimeImmutable('2018-03-16'));
});
