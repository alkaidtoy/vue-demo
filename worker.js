addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': 'https://[你的GitHub用户名].github.io',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With, X-XSRF-TOKEN',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
  }

  const url = new URL(request.url)
  const apiUrl = 'https://dev.178778.xyz' + url.pathname

  // 转发请求到 API 服务器
  const response = await fetch(apiUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' ? request.body : null,
    credentials: 'include'
  })

  // 创建新的响应并添加 CORS 头
  const newResponse = new Response(response.body, response)
  newResponse.headers.set('Access-Control-Allow-Origin', 'https://[你的GitHub用户名].github.io')
  newResponse.headers.set('Access-Control-Allow-Credentials', 'true')

  return newResponse
} 