import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from '../notifications/notifications.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
  },
  membershipTier: { findFirst: jest.fn().mockResolvedValue(null) },
  membership: { create: jest.fn() },
  passwordReset: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
  $transaction: jest.fn((fns: any[]) => Promise.all(fns)),
};

const mockJwt = { signAsync: jest.fn().mockResolvedValue('test-token') };
const mockConfig = { get: jest.fn((key: string, def?: string) => def ?? 'test') };
const mockNotifications = { sendWelcomeEmail: jest.fn().mockResolvedValue(undefined), sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined) };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  describe('register', () => {
    it('throws ConflictException when email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(service.register({ email: 'test@test.com', password: 'Secure@123', firstName: 'A', lastName: 'B' })).rejects.toThrow(ConflictException);
    });

    it('creates user and returns tokens', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({ id: 'u1', email: 'test@test.com', firstName: 'A', lastName: 'B', role: 'CUSTOMER' });
      const result = await service.register({ email: 'test@test.com', password: 'Secure@123', firstName: 'A', lastName: 'B' });
      expect(result).toHaveProperty('accessToken', 'test-token');
      expect(result).toHaveProperty('refreshToken', 'test-token');
      expect(result.user.email).toBe('test@test.com');
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException for invalid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login({ email: 'x@x.com', password: 'wrong' })).rejects.toThrow(UnauthorizedException);
    });

    it('returns tokens on valid credentials', async () => {
      const hash = await bcrypt.hash('correct', 10);
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'x@x.com', firstName: 'A', lastName: 'B', role: 'CUSTOMER', passwordHash: hash, isEmailVerified: true, deletedAt: null });
      const result = await service.login({ email: 'x@x.com', password: 'correct' });
      expect(result).toHaveProperty('accessToken');
      expect(result.user).not.toHaveProperty('passwordHash');
    });
  });

  describe('forgotPassword', () => {
    it('returns success message even when email does not exist (prevents enumeration)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const result = await service.forgotPassword('notfound@test.com');
      expect(result.message).toContain('If that email exists');
    });
  });
});
