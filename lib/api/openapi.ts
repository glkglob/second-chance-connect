export const openAPISpec = {
  openapi: "3.0.0",
  info: {
    title: "Second Chance Connect API",
    version: "1.0.0",
    description: "API for employment opportunities platform connecting job seekers with second chance employers.",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "sb-access-token",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "object",
            properties: {
              message: { type: "string" },
              code: { type: "string" },
              timestamp: { type: "string", format: "date-time" },
            },
          },
        },
      },
      Job: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          description: { type: "string" },
          salary_min: { type: "number" },
          salary_max: { type: "number" },
          location: { type: "string" },
          employment_type: { type: "string" },
          status: { type: "string", enum: ["active", "draft", "closed"] },
          created_at: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/jobs": {
      get: {
        summary: "List all jobs",
        tags: ["Jobs"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "location", in: "query", schema: { type: "string" } },
          { name: "type", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "List of jobs",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        jobs: { type: "array", items: { $ref: "#/components/schemas/Job" } },
                        pagination: {
                          type: "object",
                          properties: {
                            page: { type: "integer" },
                            limit: { type: "integer" },
                            total: { type: "integer" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new job",
        tags: ["Jobs"],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description", "salary_min", "salary_max", "location", "employment_type"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  salary_min: { type: "number" },
                  salary_max: { type: "number" },
                  location: { type: "string" },
                  employment_type: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Job created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Job" },
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden - Only employers can post jobs" },
        },
      },
    },
  },
}
