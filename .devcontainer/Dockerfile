FROM denoland/deno:bin AS deno
FROM mcr.microsoft.com/devcontainers/typescript-node
COPY --from=deno /deno /usr/local/bin/deno
