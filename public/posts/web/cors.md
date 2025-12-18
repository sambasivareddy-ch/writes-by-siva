---
title: "CORS"
description: "Today's topic is CORS, and we will discuss about how it made cross-origin requests possible."
author: "Siva"
date: 2025-08-29
tags: ["Web"]
canonical_url: "https://bysiva.vercel.app/blog/cors"
---

# CORS
## Definition
**_CORS (Cross-Origin Resource Sharing)_** is a security feature implemented in the **web browsers** that controls how web page from **one origin** (domain, protocol or port) can request resources from the **another origin**.
- By default, browsers enforces the `Same-Origin Policy (SOP)`, which prevents javascript running on one origin from interacting with resources from a different origin.
- CORS provides the controlled way of interacting with another origin.

## What is Origin?
An **Origin** is defined as the combination of three parts of a URL:
1. `Schema` (Protocol): _http_ or _https_
2. `Host (Domain or IP)`: Example: _example.com_, _api.example.com_
3. `Port`: Example: _:80_, _:3000_, _:5000_
Two URLs have the **same origin** only if all three match exactly.
### Example
- https://example.com:443/page
  - Origin: https://example.com:443
- http://example.com:80/page
  - Origin: http://example.com:80
- https://sub.example.com:443/api
  - Origin: https://sub.example.com:443

## Why was CORS Introduced?
- Originally, browsers enforced the **Same-Origin Policy (SOP)** to prevent malicious scripts from accessing sensitive data from another origin.
- While SOP improved security, it restricted legitimate use cases like:
  - Using APIs from different domains.
  - Decoupling frontend and backend applications.
  - Loading resources (fonts, scripts, assets) from CDNs.
- **CORS was introduced as a secure relaxation mechanism**: it lets servers declare which cross-origin requests are safe, while still protecting users.

## Implementation
**CORS is handled via HTTP headers set by the server**. Key headers include:
- `Access-Control-Allow-Origin` → specifies which origins are allowed (* for all or a specific domain).
- `Access-Control-Allow-Methods` → allowed HTTP methods (GET, POST, PUT, DELETE, PATCH & OPTIONS).
- `Access-Control-Allow-Headers` → specifies which request headers can be sent (Content-Type, Authorization..).
- `Access-Control-Allow-Credentials` → indicates if cookies or authentication info can be included.
### Example
```
    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: https://example.com
    Access-Control-Allow-Methods: GET, POST
    Access-Control-Allow-Headers: Content-Type, Authorization
    Access-Control-Allow-Credentials: true
```

## Preflight Request
A preflight request is an **HTTP OPTIONS request** that the browser automatically sends before making certain types of cross-origin requests.
- It’s like the browser asking the server:
  - “Hey, if I send this actual request (with method/headers), will you allow it?” 
- The server must reply with CORS headers confirming it’s allowed.
- If the server approves, the browser then sends the actual request.
### When the Preflight triggered?
Browsers send a preflight request when the cross-origin request is not simple.
✅ **Simple requests (no preflight)**:
- Methods: `GET, POST, HEAD`
- Headers: Only allowed ones like Accept, Content-Type `(with text/plain, application/x-www-form-urlencoded, multipart/form-data)`
- No credentials unless explicitly allowed
❌ **Non-simple requests (preflight needed)**:
- Methods: `PUT, DELETE, PATCH`
- Custom headers `(Authorization, X-Custom-Header, etc.)`
- Content-Type outside of the allowed ones `(e.g., application/json)`
- With credentials `(cookies, Authorization headers)`
### Example
Example flow (client at https://app.com, server at https://api.com)
**Step 1** – Browser sends preflight (OPTIONS request):
```
OPTIONS /data HTTP/1.1
Origin: https://app.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Content-Type, Authorization
```
**Step 2** – Server responds with allowed CORS policy:
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 3600
```
**Step 3** – Browser sends the actual request (if allowed):
```
PUT /data HTTP/1.1
Origin: https://app.com
Authorization: Bearer abc123
Content-Type: application/json
```

## Practical Usage
CORS is commonly encountered when:
- **Frontend ↔ Backend separation**: Example, a React app (`http://localhost:3000`) calling an API at (`http://localhost:5000`).
- **Third-party APIs**: Accessing Google Maps, Stripe, or other public APIs that configure CORS to allow certain origins.
- **Microservices architecture**: Services hosted on different domains/ports need cross-origin communication.
- **Authentication flows**: When sending cookies/tokens in cross-origin requests, servers must explicitly allow credentials.

## Resources
- [MDN Web Docs – CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP – Cross-Origin Resource Sharing (CORS)](https://owasp.org/www-community/cors)
- [W3C CORS Specification](https://www.w3.org/TR/cors/)
