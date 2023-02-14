FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy Package Dependencies List to Working Directory
COPY package*.json /usr/src/app/

# Install Package Dependencies
RUN npm install

# Copy All Source Code to Working Directory
COPY . /usr/src/app/

# Expose Application Port
EXPOSE 3000

# Run Application
CMD ["npm", "start"]