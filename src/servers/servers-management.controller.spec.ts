import { Test, TestingModule } from '@nestjs/testing';
import { ServersManagementController } from './servers-management.controller';

describe('ServersManagementController', () => {
  let controller: ServersManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServersManagementController],
    }).compile();

    controller = module.get<ServersManagementController>(ServersManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
