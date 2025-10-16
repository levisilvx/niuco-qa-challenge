import { test, expect } from '@playwright/test';

const baseUrl = 'https://reqres.in';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const defaultHeaders = {'x-api-key': 'reqres-free-v1'}

test.describe.parallel('Swag Labs API Tests', () => {
  test('GET /api/users?page=2 - validate fields', async ({ request }) => {
    const res = await request.get(`${baseUrl}/api/users?page=2`, { headers: defaultHeaders });
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body.data)).toBeTruthy();

    for (const user of body.data) {
      expect(user.id).toBeDefined();
      expect(user.first_name).toBeDefined();
      expect(user.last_name).toBeDefined();
      expect(user.email).toBeDefined();
      expect(EMAIL_REGEX.test(user.email)).toBeTruthy();
    }
  });

  test('POST /api/users and PUT /api/users/2 - create and update user', async ({ request }) => {
    const createPayload = { name: 'Levi Tester', job: 'QA' };
    const startCreate = Date.now();
    const createRes = await request.post(`${baseUrl}/api/users`, { data: createPayload, headers:defaultHeaders });
    const createDuration = Date.now() - startCreate;

    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    expect(created.name).toBe(createPayload.name);
    expect(created.job).toBe(createPayload.job);
    expect(created.id).toBeDefined();
    expect(createDuration).toBeLessThan(2000);

    const updatePayload = { name: 'Levi Updated', job: 'QA 2' };
    const startUpdate = Date.now();
    const updateRes = await request.put(`${baseUrl}/api/users/2`, { data: updatePayload, headers:defaultHeaders });
    const updateDuration = Date.now() - startUpdate;

    expect(updateRes.status()).toBe(200);
    const updated = await updateRes.json();
    expect(updated.name).toBe(updatePayload.name);
    expect(updated.job).toBe(updatePayload.job);
    expect(updated.updatedAt).toBeDefined();
    expect(updateDuration).toBeLessThan(2000);
  });

  test('DELETE /api/users/999 - non existing user handling', async ({ request }) => {
    const res = await request.delete(`${baseUrl}/api/users/999`, { headers: defaultHeaders });
    const status = res.status();
    if (status === 404) {
      expect(status).toBe(404);
    } else {
      expect([200, 204]).toContain(status);
    }
  });

  test('Simulate timeout and verify error handling', async ({ request }) => {
    let threw = false;
    try {
      await request.get(`${baseUrl}/api/users?page=2`, { timeout: 1, headers:defaultHeaders });
    } catch (e: any) {
      threw = true;
      const msg = (e && e.message) ? e.message.toString().toLowerCase() : '';
      expect(msg).toMatch(/timeout/);
    }
    expect(threw).toBeTruthy();
  });
});