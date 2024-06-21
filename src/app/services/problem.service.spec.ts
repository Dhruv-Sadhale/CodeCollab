import { TestBed } from '@angular/core/testing';

import { ProblemService } from './problem.service';
import { beforeEach, describe, it } from 'node:test';

describe('ProblemService', () => {
  let service: ProblemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProblemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
function expect(service: ProblemService) {
  throw new Error('Function not implemented.');
}

