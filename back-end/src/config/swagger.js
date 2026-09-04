const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventHub Ticketing API Documentation',
      version: '1.0.0',
      description:
        'RESTful API documentation for EventHub - Full-Stack Event and Movie Ticket Booking Platform with Role-Based Access Control (User, Organiser, Admin).',
      contact: {
        name: 'EventHub Engineering Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT Bearer token to test role-protected endpoints',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66d82a1f8e4b3c0012a9e01' },
            name: { type: 'string', example: 'Rohan Sharma' },
            email: { type: 'string', example: 'rohan@example.com' },
            phone: { type: 'string', example: '+91 9876543210' },
            city: { type: 'string', example: 'Mumbai' },
            role: { type: 'string', enum: ['USER', 'ORGANISER', 'ADMIN'], example: 'USER' },
            organiserStatus: { type: 'string', nullable: true, enum: ['PENDING', 'APPROVED', 'REJECTED'], example: null },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66d82a1f8e4b3c0012a9e02' },
            name: { type: 'string', example: 'Movies' },
            slug: { type: 'string', example: 'movies' },
          },
        },
        Event: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66d82a1f8e4b3c0012a9e03' },
            title: { type: 'string', example: 'Interstellar - IMAX 70mm Experience' },
            description: { type: 'string', example: 'Epic sci-fi masterpiece directed by Christopher Nolan.' },
            category: { type: 'string', example: '66d82a1f8e4b3c0012a9e02' },
            bannerUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1' },
            city: { type: 'string', example: 'Mumbai' },
            venue: { type: 'string', example: 'PVR INOX IMAX, Lower Parel' },
            language: { type: 'string', example: 'English' },
            durationMinutes: { type: 'number', example: 169 },
            status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'], example: 'PUBLISHED' },
            isFeatured: { type: 'boolean', example: true },
          },
        },
        Showtime: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66d82a1f8e4b3c0012a9e04' },
            event: { type: 'string', example: '66d82a1f8e4b3c0012a9e03' },
            dateTime: { type: 'string', format: 'date-time', example: '2026-09-10T18:30:00.000Z' },
            price: { type: 'number', example: 450 },
            totalSeats: { type: 'number', example: 150 },
            seatsAvailable: { type: 'number', example: 142 },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66d82a1f8e4b3c0012a9e05' },
            bookingRef: { type: 'string', example: 'BMS-849201' },
            user: { type: 'string', example: '66d82a1f8e4b3c0012a9e01' },
            showtime: { type: 'string', example: '66d82a1f8e4b3c0012a9e04' },
            numTickets: { type: 'number', example: 2 },
            totalAmount: { type: 'number', example: 900 },
            status: { type: 'string', enum: ['CONFIRMED', 'CANCELLED'], example: 'CONFIRMED' },
          },
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66d82a1f8e4b3c0012a9e06' },
            user: { type: 'string', example: '66d82a1f8e4b3c0012a9e01' },
            event: { type: 'string', example: '66d82a1f8e4b3c0012a9e03' },
            rating: { type: 'number', example: 5 },
            comment: { type: 'string', example: 'Mindblowing cinematic experience!' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
