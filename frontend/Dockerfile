FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source
COPY . .

# Create entrypoint script to handle permissions
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'if [ -f /app/package.json ]; then' >> /entrypoint.sh && \
    echo '  chmod 644 /app/package.json' >> /entrypoint.sh && \
    echo '  chmod 644 /app/package-lock.json 2>/dev/null || true' >> /entrypoint.sh && \
    echo 'fi' >> /entrypoint.sh && \
    echo 'exec "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "run", "dev"]
