import { beforeEach, describe, expect, it, vi } from 'vitest';
const fetch = vi.hoisted(() => vi.fn());
vi.mock('@/app/fetchDashboard', () => ({ fetchDashboard: fetch }));
import { fetchDashboardQueued } from './dashboard-request-queue';

function deferred() {
  let resolve!: (value: never[]) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<never[]>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

beforeEach(() => fetch.mockReset());

describe('tab dashboard request queue', () => {
  it('serializes polling, older posts, and refresh in submission order', async () => {
    const polling = deferred();
    const older = deferred();
    const latest = deferred();
    fetch
      .mockReturnValueOnce(polling.promise)
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(latest.promise);
    const first = fetchDashboardQueued({ since_id: '1000', limit: 20 });
    const second = fetchDashboardQueued({ before_id: '900', limit: 18 });
    const third = fetchDashboardQueued({ limit: 18 });
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenLastCalledWith({ since_id: '1000', limit: 20 });
    polling.resolve([]);
    await first;
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(fetch).toHaveBeenLastCalledWith({ before_id: '900', limit: 18 });
    older.resolve([]);
    await second;
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
    expect(fetch).toHaveBeenLastCalledWith({ limit: 18 });
    latest.resolve([]);
    await third;
  });

  it('returns errors to callers and still runs requests queued behind a failure', async () => {
    const failed = deferred();
    fetch.mockReturnValueOnce(failed.promise).mockResolvedValueOnce([]);
    const first = fetchDashboardQueued({ since_id: '1000' });
    const rejection = expect(first).rejects.toThrow('offline');
    const second = fetchDashboardQueued({ before_id: '900' });
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    failed.reject(new Error('offline'));
    await rejection;
    await expect(second).resolves.toEqual([]);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('recovers from a synchronous error starting a server action', async () => {
    fetch
      .mockImplementationOnce(() => {
        throw new Error('could not start');
      })
      .mockResolvedValueOnce([]);
    const first = fetchDashboardQueued({ since_id: '1000' });
    const second = fetchDashboardQueued({ before_id: '900' });
    await expect(first).rejects.toThrow('could not start');
    await expect(second).resolves.toEqual([]);
  });
});
