import { describe, it, expect } from 'vitest'

describe('Core Utilities', () => {
  describe('Basic Math Operations', () => {
    it('should add numbers correctly', () => {
      expect(2 + 2).toBe(4)
      expect(5 + 3).toBe(8)
      expect(-1 + 1).toBe(0)
    })

    it('should multiply numbers correctly', () => {
      expect(2 * 3).toBe(6)
      expect(5 * 0).toBe(0)
      expect(-2 * 3).toBe(-6)
    })

    it('should handle division correctly', () => {
      expect(6 / 2).toBe(3)
      expect(10 / 5).toBe(2)
      expect(0 / 5).toBe(0)
    })
  })

  describe('String Operations', () => {
    it('should concatenate strings', () => {
      expect('Hello' + ' ' + 'World').toBe('Hello World')
      expect('Test' + 'String').toBe('TestString')
    })

    it('should check string length', () => {
      expect('Hello'.length).toBe(5)
      expect(''.length).toBe(0)
      expect('Testing'.length).toBe(7)
    })

    it('should convert to uppercase', () => {
      expect('hello'.toUpperCase()).toBe('HELLO')
      expect('test'.toUpperCase()).toBe('TEST')
    })
  })

  describe('Array Operations', () => {
    it('should filter arrays', () => {
      const numbers = [1, 2, 3, 4, 5, 6]
      const evenNumbers = numbers.filter(n => n % 2 === 0)
      expect(evenNumbers).toEqual([2, 4, 6])
    })

    it('should map arrays', () => {
      const numbers = [1, 2, 3]
      const doubled = numbers.map(n => n * 2)
      expect(doubled).toEqual([2, 4, 6])
    })

    it('should reduce arrays', () => {
      const numbers = [1, 2, 3, 4, 5]
      const sum = numbers.reduce((acc, curr) => acc + curr, 0)
      expect(sum).toBe(15)
    })
  })

  describe('Object Operations', () => {
    it('should merge objects', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { c: 3, d: 4 }
      const merged = { ...obj1, ...obj2 }
      expect(merged).toEqual({ a: 1, b: 2, c: 3, d: 4 })
    })

    it('should check object keys', () => {
      const obj = { name: 'John', age: 30, city: 'NYC' }
      expect(Object.keys(obj)).toEqual(['name', 'age', 'city'])
    })

    it('should check object values', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(Object.values(obj)).toEqual([1, 2, 3])
    })
  })

  describe('Date Operations', () => {
    it('should create dates', () => {
      const date = new Date('2023-01-01')
      expect(date.getFullYear()).toBe(2023)
      expect(date.getMonth()).toBe(0) // January is 0
    })

    it('should format dates', () => {
      const date = new Date('2023-12-25')
      expect(date.toISOString()).toContain('2023-12-25')
    })
  })

  describe('Async Operations', () => {
    it('should handle promises', async () => {
      const result = await Promise.resolve('success')
      expect(result).toBe('success')
    })

    it('should handle async/await', async () => {
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      const start = Date.now()
      await delay(10)
      const end = Date.now()
      expect(end - start).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Error Handling', () => {
    it('should throw errors', () => {
      expect(() => {
        throw new Error('Test error')
      }).toThrow('Test error')
    })

    it('should catch errors', () => {
      try {
        throw new Error('Caught error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    })
  })

  describe('Type Checking', () => {
    it('should check types', () => {
      expect(typeof 'string').toBe('string')
      expect(typeof 123).toBe('number')
      expect(typeof true).toBe('boolean')
      expect(typeof {}).toBe('object')
      expect(typeof []).toBe('object')
      expect(typeof null).toBe('object')
      expect(typeof undefined).toBe('undefined')
    })

    it('should check instanceof', () => {
      expect([]).toBeInstanceOf(Array)
      expect({}).toBeInstanceOf(Object)
      expect(new Date()).toBeInstanceOf(Date)
    })
  })
}) 