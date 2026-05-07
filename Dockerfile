FROM node:20-slim

# Install FFMPEG and Chromium dependencies required by Remotion
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    chromium \
    libnss3 \
    libdbus-1-3 \
    libatk1.0-0 \
    libgbm1 \
    libasound2 \
    libxrandr2 \
    libxext6 \
    libx11-6 \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Ensure renders directory exists and has correct permissions
RUN mkdir -p public/renders && chmod 777 public/renders

# Expose the server port
EXPOSE 3001

# Start the Express server
CMD ["npm", "run", "dev:server"]
