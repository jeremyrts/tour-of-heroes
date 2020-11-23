import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.messages.length).toEqual(0)
  });

  it('should clear the messages', () =>{
    service.add("Message 1")
    service.add("Message 2")
    service.clear()
    expect(service.messages.length).toEqual(0)
  })

  it('should add 2 messages', () => {
    service.add("Message 1")
    service.add("Message 2")
    expect(service.messages.length).toEqual(2)
  })
});
