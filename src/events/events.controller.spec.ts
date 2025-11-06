import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let eventsService: EventsService;
  let eventsController: EventsController;
  let eventsRepo;
  beforeAll(() => console.log('Starting EventsController tests')); // this runs only one time
  beforeEach(() => {
    //this runs before each test
    eventsService = new EventsService();
    eventsController = new EventsController(eventsService);
  });
  it('should return a list of events', () => {
    // it === test
  });
});
