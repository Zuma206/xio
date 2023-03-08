import { fetchAPI } from "./api";

export async function getWebhook(channelId: string, authToken: string) {
  const res = await fetchAPI(
    location.origin + `/api/webhooks/${channelId}`,
    authToken
  );
  return res;
}

export async function setWebhook(
  channelId: string,
  url: string,
  authToken: string
) {
  const res = await fetchAPI(
    location.origin + `/api/webhooks/${channelId}`,
    authToken,
    {
      url,
    }
  );
  return res;
}
