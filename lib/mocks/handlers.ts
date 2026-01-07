import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:3000/api/v1';

export const handlers = [
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as any;

    return HttpResponse.json({
      code: 200,
      message: 'Login Successful',
      data: {
        token: 'mock-jwt-token-xyz',
        user: {
          id: 1,
          name: 'Demo',
          surname: 'Student',
          email: body.email || 'demo@iyte.edu.tr',
          role: 'Standard',
        },
      },
    });
  }),

  http.get(`${API_URL}/projects`, () => {
    return HttpResponse.json({
      code: 200,
      message: 'Projects retrieved successfully',
      data: {
        projects: [
          {
            id: 1,
            title: 'Campus Navigation App',
            description: 'A mobile application helping students find classrooms.',
            tags: ['React Native', 'Java', 'Maps'],
            status: 'OPEN',
            image_url: 'https://picsum.photos/400/300',
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: 'Refectory Menu Bot',
            description: 'Telegram bot that sends daily lunch menus.',
            tags: ['Python', 'Telegram API'],
            status: 'OPEN',
            image_url: null,
            created_at: new Date().toISOString(),
          },
        ],
        currentPage: 0,
        totalPages: 1,
        totalElements: 2,
      },
    });
  }),

  http.get(`${API_URL}/projects/:id`, ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      code: 200,
      message: 'Project details retrieved successfully',
      data: {
        id: Number(id),
        title: `Mock Project Details ${id}`,
        description: 'This is a detailed description for testing purposes. It simulates a full project page content.',
        tags: ['Mock', 'Test', 'Education'],
        status: 'OPEN',
        image_url: 'https://picsum.photos/800/400',
        owner: {
          id: 99,
          name: 'Academic',
          surname: 'Advisor',
          email: 'advisor@iyte.edu.tr'
        },
        created_at: new Date().toISOString(),
      },
    });
  }),
];