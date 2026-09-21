import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ auth: vi.fn(), request: vi.fn() }));
vi.mock('@/auth', () => ({ auth: mocks.auth }));
vi.mock('@/app/tumblrClient', () => ({
  tumblrRequest: mocks.request,
  TumblrApiError: class extends Error {},
}));
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('redirect');
  }),
}));
import { fetchDashboard } from './fetchDashboard';

beforeEach(() => {
  mocks.auth.mockResolvedValue({ access_token: 'test', user: { id: 'test' } });
  mocks.request.mockResolvedValue({ response: { posts: [] } });
});
describe('dashboard request parameters', () => {
  it('sends an exact string cursor without an offset', async () => {
    await fetchDashboard({ before_id: '9007199254740993', limit: 16 });
    expect(mocks.request.mock.calls[0][0].params).toEqual({
      before_id: '9007199254740993',
      limit: '16',
      npf: 'true',
    });
  });
  it('keeps new-post polling separate from older-post requests', async () => {
    await fetchDashboard({ since_id: '1000', limit: 20 });
    expect(mocks.request.mock.calls[0][0].params).toEqual({
      since_id: '1000',
      limit: '20',
      offset: '0',
      npf: 'true',
    });
  });
  it('rejects incompatible cursors and oversized requests', async () => {
    await expect(
      fetchDashboard({ before_id: '1000', offset: 18 })
    ).rejects.toThrow();
    await expect(
      fetchDashboard({ before_id: '1000', since_id: '900' })
    ).rejects.toThrow();
    await expect(fetchDashboard({ limit: 50 })).rejects.toThrow();
    expect(mocks.request).not.toHaveBeenCalled();
  });
});
