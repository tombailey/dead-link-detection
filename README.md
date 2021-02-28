# Dead Link Detection

A simple nodejs app to detect broken links. It makes use of [puppeteer](https://github.com/puppeteer/puppeteer) to launch a headless Chrome browser instance to test links.

## Getting started

### Start the API

In a local environment, you will probably want to use and test with Docker
```sh
docker build . -t dead-link-detection && docker run --cap-add=SYS_ADMIN -p 8080:8080 dead-link-detection
```

### Send an analysis request

POST http://localhost:8080/links/analyze with the JSON body:

```json
{
  "link": "https://mydomain.com/potentially-broken.html"
}
```

If your request is valid, you should expect a response like:

```json
{
  "status": "content_missing",
  "isLikelyTemporaryIssue": false,
  "consideredBroken": true
}
```

See [Responses](#Responses) for a full list of responses.

## Responses

### Working
The link has been determined to be working.
```json
{
    "status": "working",
    "consideredBroken": false
}
```

### Content missing
The link is not working because the content is missing.
```json
{
    "status": "content_missing",
    "isLikelyTemporaryIssue": false,
    "consideredBroken": true
}
```

### DNS error
The link is not working because of a DNS issue. It is possible this may be a temporary issue so it is recommended to check the link again later to verify.
```json
{
    "status": "dns_error",
    "isLikelyTemporaryIssue": true,
    "consideredBroken": true
}
```

### Certificate error
The link is not working because of SSL/TLS certificate issue. It is possible this may be a temporary issue so it is recommended to check the link again later to verify.
```json
{
    "status": "certificate_error",
    "isLikelyTemporaryIssue": true,
    "consideredBroken": true
}
```

### Network error
The link is not working because of a generic network error. It is possible this may be a temporary issue so it is recommended to check the link again later to verify.
```json
{
    "status": "network_error",
    "isLikelyTemporaryIssue": true,
    "consideredBroken": true
}
```

## Deployment

A prebuilt docker images are available on [Docker Hub](https://hub.docker.com/repository/docker/tombailey256/dead-link-detection) as `tombailey256/dead-link-detection`.

### Kubernetes

See [deployment.yaml](deployment.yaml) for an example Deployment and Service.

## Monitoring

### Health check

Send a GET request to `/health` and expect a response with a 200 status code and the following body:
 ```json
{ 
  "status": "pass"
}
```

## Future work

The following items are desirable features for the future:

- analyze the HTML returned from seemingly okay pages to check they aren't actually broken 
    - e.g. 200 status code -> client-side rendering/AJAX request -> "not found" in HTML
- grpc support
- prometheus metrics support
- CI/CD for automated testing and docker image pushes
