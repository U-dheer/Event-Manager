import { Event } from './event.entity';

test('Event should be initialized through constructor', () => {
  const event = new Event({
    name: 'Sample Event',
    description: 'This is a sample event.',
  });

  expect(event).toEqual({
    name: 'Sample Event',
    description: 'This is a sample event.',
    id: undefined,
    when: undefined,
    address: undefined,
    organizerId: undefined,
    organizer: undefined,
    event: undefined,
    attendeeCount: undefined,
    attendeeRejected: undefined,
    attendeeMaybe: undefined,
    attendeeAccepted: undefined,
    attendees: undefined,
  });
});
