exports.annotations = {
  openapi: "3.0.0",
  info: {
    title: "Parking Management API",
    version: "1.0.0",
    description:
      "API for managing users, parking information, and recording incoming or outgoing cars in the parking",
  },
  servers: [
    {
      url: "http://localhost:2020",
      description: "Local Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    "/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Invalid input or user already exists" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful, returns JWT token" },
          400: { description: "Invalid credentials" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/v1/parking": {
      post: {
        tags: ["Parking"],
        summary: "Create a new parking entry",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "code",
                  "parking_name",
                  "n_space_available",
                  "location",
                  "charging_hour",
                ],
                properties: {
                  code: { type: "integer" },
                  parking_name: { type: "string" },
                  n_space_available: { type: "integer" },
                  location: { type: "string" },
                  charging_hour: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Parking created successfully" },
          400: { description: "Invalid input or parking already exists" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          500: { description: "Internal server error" },
        },
      },
      get: {
        tags: ["Parking"],
        summary: "Retrieve parking entries with pagination",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", default: 5 },
          },
        ],
        responses: {
          200: { description: "List of parking entries with pagination" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/v1/parking/all": {
      get: {
        tags: ["Parking"],
        summary: "Retrieve all parking entries",
        responses: {
          200: { description: "List of parking entries" },
          400: { description: "Unable to retrieve parking entries" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/v1/parking/update/{id}": {
      put: {
        tags: ["Parking"],
        summary: "Update a parking entry by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  parking_name: { type: "string" },
                  n_space_available: { type: "integer" },
                  location: { type: "string" },
                  charging_hour: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Parking updated successfully" },
          400: { description: "Invalid input" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Parking not found" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/v1/parking/delete/{id}": {
      delete: {
        tags: ["Parking"],
        summary: "Delete a parking entry by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Parking deleted successfully" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Parking not found" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/v1/parking/search": {
      get: {
        tags: ["Parking"],
        summary: "Search for parking entries",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Search results" },
          400: { description: "Search keyword is required" },
          500: { description: "Internal server error" },
        },
      },
    },
    "/v1/car-entry/entry": {
      post: {
        tags: ["Car Entry"],
        summary: "Register a car entry into the parking",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["plate_number", "parking_code"],
                properties: {
                  plate_number: {
                    type: "string",
                    example: "RA123XYZ",
                  },
                  parking_code: {
                    type: "string",
                    example: "PK-001",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Car entry registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    ticket: {
                      type: "object",
                      properties: {
                        plate_number: { type: "string" },
                        entry_time: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Invalid input or no available parking" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/v1/car-entry/exit/{id}": {
      put: {
        tags: ["Car Entry"],
        summary: "Register a car's exit and generate billing",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Car entry ticket ID",
          },
        ],
        responses: {
          200: {
            description: "Exit registered and bill generated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    duration: { type: "string" },
                    charged_amount: { type: "number" },
                  },
                },
              },
            },
          },
          404: { description: "Car entry not found" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
    },
  },
};
