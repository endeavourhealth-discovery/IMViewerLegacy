import { TestBed } from '@angular/core/testing';

import { RecordModelService } from './record-model.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('RecordModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: RecordModelService = TestBed.get(RecordModelService);
    expect(service).toBeTruthy();
  });
});
