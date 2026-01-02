import { login } from '../src/auth/auth.service';
import { UsersModel } from '../src/models/user.model';
import ipAddressModel from '../src/models/ipAddress.model';
import LoginLog from '../src/models/loginLog.model';
import bcrypt from 'bcryptjs';

jest.mock('../src/models/user.model', () => ({
  UsersModel: {
    findOne: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../src/models/ipAddress.model', () => ({
  __esModule: true,
  default: {
    findOrCreate: jest.fn(),
  },
}));

jest.mock('../src/models/loginLog.model', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'jwt_token'),
}));

jest.mock('../src/helpers/responseService', () => ({
  getResponseMessage: jest.fn((key) => key),
  setErrorResponse: jest.fn((opts) => ({ ...opts })),
  setSuccessResponse: jest.fn((opts) => ({ ...opts })),
}));

describe('auth.login (unit tests)', () => {
  const defaultLoginData = { email: 'test@example.com', password: 'pass', ip_address: '1.2.3.4' };

  beforeEach(() => {
    jest.clearAllMocks();
    (UsersModel.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashed',
      block_15: false,
      max_attempts: 5,
      max_ip_attempts: 100,
      update: jest.fn(),
    });
    (ipAddressModel.findOrCreate as jest.Mock).mockResolvedValue([{ id: 10, number_of_attempts: 0, is_ip_blocked: false, update: jest.fn() }, true]);
    (LoginLog.findOne as jest.Mock).mockResolvedValue(null);
    (LoginLog.count as jest.Mock).mockResolvedValue(0);
    (LoginLog.create as jest.Mock).mockResolvedValue({});
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
  });

  it('returns USER_NOT_FOUND when user does not exist', async () => {
    (UsersModel.findOne as jest.Mock).mockResolvedValue(null);

    const res = await login(defaultLoginData as any);

    expect(res.message).toBe('USER_NOT_FOUND');
  });

  it('returns IP_BLOCKED when ip is blocked', async () => {
    (ipAddressModel.findOrCreate as jest.Mock).mockResolvedValue([{ id: 10, is_ip_blocked: true }, false]);

    const res = await login(defaultLoginData as any);

    expect(res.message).toBe('IP_BLOCKED');
  });

  it('allows successful login when password valid', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const user = {
      id: 3,
      email: 'u3@example.com',
      username: 'u3',
      password: 'hashed',
      block_15: false,
      max_attempts: 5,
      max_ip_attempts: 100,
    };
    (UsersModel.findOne as jest.Mock).mockResolvedValue(user);

    const res = await login({ ...defaultLoginData, email: 'u3@example.com' } as any);

    expect(res.message).toBe('LOGIN_SUCCESS');
    expect(res.data).toBeDefined();
    expect(res.data.access_token).toBeDefined();
    expect(UsersModel.update).toHaveBeenCalledWith(expect.objectContaining({ refresh_token: expect.anything(), block_15: false }), { where: { id: user.id } });
    expect(LoginLog.create).toHaveBeenCalledWith(expect.objectContaining({ ip_id: 10, user_id: user.id, is_successful: true }));
  });

  it('increments IP attempts and blocks IP when threshold reached', async () => {
    const ipRecord = { id: 12, number_of_attempts: 99, is_ip_blocked: false, update: jest.fn() };
    (ipAddressModel.findOrCreate as jest.Mock).mockResolvedValue([ipRecord, false]);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const user = {
      id: 5,
      email: 'u5@example.com',
      username: 'u5',
      password: 'hashed',
      block_15: false,
      max_attempts: 999,
      max_ip_attempts: 100,
      update: jest.fn(),
    };
    (UsersModel.findOne as jest.Mock).mockResolvedValue(user);

    const res = await login({ ...defaultLoginData, email: 'u5@example.com' } as any);

    expect(res.message).toBe('IP_BLOCKED');
    expect(ipRecord.update).toHaveBeenCalledWith({ number_of_attempts: 100, is_ip_blocked: true });
    expect(LoginLog.create).toHaveBeenCalledWith(expect.objectContaining({ ip_id: ipRecord.id, user_id: user.id }));
  });

  it('increments IP attempts and returns INVALID_CREDENTIALS when below thresholds', async () => {
    const ipRecord = { id: 13, number_of_attempts: 0, is_ip_blocked: false, update: jest.fn() };
    (ipAddressModel.findOrCreate as jest.Mock).mockResolvedValue([ipRecord, false]);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const user = {
      id: 6,
      email: 'u6@example.com',
      username: 'u6',
      password: 'hashed',
      block_15: false,
      max_attempts: 5,
      max_ip_attempts: 100,
      update: jest.fn(),
    };
    (UsersModel.findOne as jest.Mock).mockResolvedValue(user);

    const res = await login({ ...defaultLoginData, email: 'u6@example.com' } as any);

    expect(res.message).toBe('INVALID_CREDENTIALS');
    expect(ipRecord.update).toHaveBeenCalledWith({ number_of_attempts: 1, is_ip_blocked: false });
    expect(LoginLog.create).toHaveBeenCalledWith(expect.objectContaining({ ip_id: ipRecord.id, user_id: user.id }));
  });
});