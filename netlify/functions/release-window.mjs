import { getReleaseWindow } from '../../app/server/releaseCalendar.mjs'

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
}

export default async function releaseWindow(request) {
  if (request.method === 'HEAD') return new Response(null, { status: 200, headers })
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...headers, Allow: 'GET, HEAD' },
    })
  }

  try {
    return Response.json(getReleaseWindow(new Date()), { headers })
  } catch {
    return Response.json({ error: 'Release calendar unavailable' }, { status: 503, headers })
  }
}
