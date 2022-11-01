import { Test, TestingModule } from '@nestjs/testing';
import { ServersManagementService } from './servers-management.service';

describe('ServersManagementService', () => {
  let service: ServersManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServersManagementService],
    }).compile();

    service = module.get<ServersManagementService>(ServersManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
