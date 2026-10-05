import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
	const url = new URL(request.url);
	const targetUrl = url.searchParams.get('url');

	if (!targetUrl) {
		return new Response('Missing url parameter', { status: 400 });
	}

	try {
		const decodedUrl = decodeURIComponent(targetUrl);
		const response = await fetch(decodedUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
				'Referer': ''
			}
		});

		if (!response.ok) {
			return new Response('Failed to fetch image', { status: response.status });
		}

		const blob = await response.arrayBuffer();
		const contentType = response.headers.get('content-type') || 'image/jpeg';

		return new Response(blob, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=604800, immutable'
			}
		});
	} catch (e) {
		return new Response('Image Proxy Error', { status: 500 });
	}
};