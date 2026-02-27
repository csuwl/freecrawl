# Freecrawl Helm Chart
This Helm chart deploys Freecrawl components (API, Worker, Playwright service, Redis, etc.) on a Kubernetes cluster using environment-specific overlays.

## Pre-deployment

1. **Configure Secrets and ConfigMaps:**
   - Update `values.yaml` with the necessary environment-specific values in the `overlays/<dev|prod>/values.yaml` file.
   - **Note:** If using `REDIS_PASSWORD`, adjust the `REDIS_URL` and `REDIS_RATE_LIMIT_URL` in the ConfigMap to include the password.

2. **Build and Push Docker Images:**
   - API/Worker:
     ```bash
     docker build --no-cache --platform linux/amd64 -t ghcr.io/winkk-dev/freecrawl:latest ../../../apps/api
     docker push ghcr.io/winkk-dev/freecrawl:latest
     ```
   - Playwright Service:
     ```bash
     docker build --no-cache --platform linux/amd64 -t ghcr.io/winkk-dev/freecrawl-playwright:latest ../../../apps/playwright-service
     docker push ghcr.io/winkk-dev/freecrawl-playwright:latest
     ```

## Deployment

Render the manifests for review:
```bash
helm template winkk-ai . -f values.yaml -f overlays/dev/values.yaml -n winkk-ai
```

Deploy or upgrade the release:
```bash
helm upgrade freecrawl . -f values.yaml -f overlays/dev/values.yaml -n freecrawl --install --create-namespace
```

## Testing

Forward the API service port to your local machine:
```bash
kubectl port-forward svc/freecrawl-api 3002:3002 -n freecrawl
```

## Cleanup

To uninstall the deployment:
```bash
helm uninstall freecrawl -n freecrawl
```
```

---

This README provides a quick guide to configuring, deploying, testing, and cleaning up your Freecrawl installation using Helm.