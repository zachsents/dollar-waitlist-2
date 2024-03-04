FROM oven/bun

WORKDIR /home/bun/app
COPY . .
RUN bun install
RUN bun run build

EXPOSE 3000
ENTRYPOINT [ "bun", "." ]