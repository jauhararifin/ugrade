import { ValidationError } from 'yup'
import { clarificationServiceValidator } from './validator'

describe('test clarification validation', () => {
  test.each([
    ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', ''],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', '-zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6'],
    ['dQRjAQKKvmA3gAeHYzLpfCs84Vjs', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6aisjd8'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuS'],
  ])(
    'getClarificationById should throw validation error',
    async (token, clarifId) => {
      const result = clarificationServiceValidator.getClarificationById(
        token,
        clarifId
      )
      await expect(result).rejects.toBeInstanceOf(ValidationError)
      await expect(result).rejects.toHaveProperty('errors')
    }
  )

  test.each([
    ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'dQRjAQKK9vmA3gAeH9YzLpfC9s849Vjs'],
  ])('getClarificationById should resolved', async (token, clarifId) => {
    const result = clarificationServiceValidator.getClarificationById(
      token,
      clarifId
    )
    await expect(result).resolves.toBeDefined()
  })

  test.each([
    ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', ''],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', '-zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6'],
    ['dQRjAQKKvmA3gAeHYzLpfCs84Vjs', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6aisjd8'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuS'],
  ])(
    'getClarificationEntries should throw validation error',
    async (token, clarifId) => {
      const result = clarificationServiceValidator.getClarificationEntries(
        token,
        clarifId
      )
      await expect(result).rejects.toBeInstanceOf(ValidationError)
      await expect(result).rejects.toHaveProperty('errors')
    }
  )

  test.each([
    ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'dQRjAQKK9vmA3gAeH9YzLpfC9s849Vjs'],
  ])('getClarificationEntries should resolved', async (token, clarifId) => {
    const result = clarificationServiceValidator.getClarificationEntries(
      token,
      clarifId
    )
    await expect(result).resolves.toBeDefined()
  })

  test.each([
    ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', ''],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', '-zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6'],
    ['dQRjAQKKvmA3gAeHYzLpfCs84Vjs', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6aisjd8'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuS'],
  ])(
    'getContestClarifications should throw validation error',
    async (token, clarifId) => {
      const result = clarificationServiceValidator.getContestClarifications(
        token,
        clarifId
      )
      await expect(result).rejects.toBeInstanceOf(ValidationError)
      await expect(result).rejects.toHaveProperty('errors')
    }
  )

  test.each([
    ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'dQRjAQKK9vmA3gAeH9YzLpfC9s849Vjs'],
  ])('getContestClarifications should resolved', async (token, clarifId) => {
    const result = clarificationServiceValidator.getContestClarifications(
      token,
      clarifId
    )
    await expect(result).resolves.toBeDefined()
  })

  test.each([
    ['-n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', 'title', 'subject', 'content'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', '', 'subject', 'content'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'a'.repeat(256), 'subject', 'content'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'title', '', 'content'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'title', 'a'.repeat(256), 'content'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'title', 'subject', ''],
    [
      'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
      'title',
      'subject',
      'a'.repeat(4 * 1024 + 1),
    ],
  ])(
    'createClarification should throw validation error',
    async (token, title, subject, content) => {
      const result = clarificationServiceValidator.createClarification(
        token,
        title,
        subject,
        content
      )
      await expect(result).rejects.toBeInstanceOf(ValidationError)
      await expect(result).rejects.toHaveProperty('errors')
    }
  )

  test.each([
    ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', 'title', 'subject', 'content'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'a'.repeat(255), 'subject', 'content'],
    ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', 'title', 'a'.repeat(255), 'content'],
    [
      'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
      'title',
      'subject',
      'a'.repeat(4 * 1024),
    ],
    [
      'n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ',
      'a'.repeat(255),
      'a'.repeat(255),
      'a'.repeat(4 * 1024),
    ],
  ])(
    'createClarification should resolved',
    async (token, title, subject, content) => {
      const result = clarificationServiceValidator.createClarification(
        token,
        title,
        subject,
        content
      )
      await expect(result).resolves.toBeDefined()
    }
  )

  test.each([
    ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', '', 'content'],
    [
      'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
      '-zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
      'content',
    ],
    [
      'dQRjAQKKvmA3gAeHYzLpfCs84Vjs',
      'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6aisjd8',
      'content',
    ],
    [
      'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
      'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuS',
      'content',
    ],
    [
      'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
      'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
      '',
    ],
    [
      'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
      'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
      'a'.repeat(4 * 1024 + 1),
    ],
  ])(
    'replyClarification should throw validation error',
    async (token, clarifId, content) => {
      const result = clarificationServiceValidator.replyClarification(
        token,
        clarifId,
        content
      )
      await expect(result).rejects.toBeInstanceOf(ValidationError)
      await expect(result).rejects.toHaveProperty('errors')
    }
  )

  test.each([
    [
      'n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ',
      'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
      'content',
    ],
    [
      'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
      'dQRjAQKK9vmA3gAeH9YzLpfC9s849Vjs',
      'a'.repeat(4 * 1024),
    ],
  ])('replyClarification should resolved', async (token, clarifId, content) => {
    const result = clarificationServiceValidator.replyClarification(
      token,
      clarifId,
      content
    )
    await expect(result).resolves.toBeDefined()
  })

  test.each([
    ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', ''],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', '-zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6'],
    ['dQRjAQKKvmA3gAeHYzLpfCs84Vjs', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6aisjd8'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuS'],
  ])(
    'readClarificationEntry should throw validation error',
    async (token, clarifId) => {
      const result = clarificationServiceValidator.readClarificationEntry(
        token,
        clarifId
      )
      await expect(result).rejects.toBeInstanceOf(ValidationError)
      await expect(result).rejects.toHaveProperty('errors')
    }
  )

  test.each([
    ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6'],
    ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'dQRjAQKK9vmA3gAeH9YzLpfC9s849Vjs'],
  ])('readClarificationEntry should resolved', async (token, clarifId) => {
    const result = clarificationServiceValidator.readClarificationEntry(
      token,
      clarifId
    )
    await expect(result).resolves.toBeDefined()
  })
})
