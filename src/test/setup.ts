import { vi } from 'vitest'

// Mock Date.now for consistent testing
const mockDate = new Date('2024-01-01T00:00:00.000Z')
vi.spyOn(Date, 'now').mockImplementation(() => mockDate.getTime())

// Setup jsdom environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
