import "@testing-library/jest-dom"
import { TextEncoder, TextDecoder } from "util"
import { jest } from "@jest/globals"

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Mock Next.js Request/Response
class MockNextRequest extends Request {
  nextUrl: URL
  cookies: any

  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init)
    this.nextUrl = new URL(input.toString())
    this.cookies = {
      get: jest.fn(),
      getAll: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    }
  }
}

// @ts-ignore
global.NextRequest = MockNextRequest
