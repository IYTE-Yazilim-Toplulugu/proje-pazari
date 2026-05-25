import { handleResponse } from '../base';
import { BasicResponseSchema } from '../../models/Api';

describe('handleResponse', () => {
  it('treats registration verification response code as success', async () => {
    const body = {
      code: 11,
      message: 'User registered successfully',
      timestamp: '2026-05-12T12:00:00',
    };
    const response = {
      status: 201,
      ok: true,
      json: jest.fn().mockResolvedValue(body),
    } as unknown as Response;

    await expect(handleResponse(response, BasicResponseSchema)).resolves.toEqual(body);
  });

  it('treats CREATED response code as success', async () => {
    const body = {
      code: 2,
      message: 'Resource created successfully',
      timestamp: '2026-05-12T12:00:00',
    };
    const response = {
      status: 201,
      ok: true,
      json: jest.fn().mockResolvedValue(body),
    } as unknown as Response;

    await expect(handleResponse(response, BasicResponseSchema)).resolves.toEqual(body);
  });
});
