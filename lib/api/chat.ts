import { fetcher, mutator } from './base';
import {
  MApplicationMessagePage,
  MApplicationMessageResponse,
  MSendApplicationMessageRequest,
  type ApplicationMessage,
  type ApplicationMessagePage,
} from '@/lib/models/Chat';

export type ApplicationMessagePageParams = {
  page?: number;
  size?: number;
};

export async function getApplicationMessages(
  applicationId: string,
  params: ApplicationMessagePageParams = {},
  signal?: AbortSignal,
): Promise<ApplicationMessagePage> {
  const query = new URLSearchParams({
    page: String(params.page ?? 0),
    size: String(params.size ?? 20),
  });
  return fetcher(
    `/api/v1/applications/${encodeURIComponent(applicationId)}/messages?${query.toString()}`,
    MApplicationMessagePage,
    signal,
  );
}

export async function sendApplicationMessage(
  applicationId: string,
  body: string,
): Promise<ApplicationMessage> {
  const request = MSendApplicationMessageRequest.parse({ body });
  const response = await mutator(
    `/api/v1/applications/${encodeURIComponent(applicationId)}/messages`,
    'post',
    MApplicationMessageResponse,
    { arg: request },
  );
  if (!response.data) {
    throw new Error('Message response did not contain data');
  }
  return response.data;
}
