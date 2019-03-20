import { ValidationError } from 'yup'
import { submissionServiceValidator as validator } from './validator'

describe('test submission service validator', () => {
  describe('test getContestSubmissions', () => {
    test.each([
      ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', ''],
      ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', '-zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6'],
      ['dQRjAQKKvmA3gAeHYzLpfCs84Vjs', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6aisjd8'],
      ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuS'],
    ])('getContestSubmissions should fail', async (token, contestId) => {
      await expect(validator.getContestSubmissions(token, contestId)).rejects.toBeInstanceOf(ValidationError)
    })

    test.each([
      ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', 'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6'],
      ['zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6', 'mzAdQRjAQKKvmA3gAeHYzLpfCs84mzAV'],
    ])('getContestSubmissions should resolved', async (token, contestId) => {
      await expect(validator.getContestSubmissions(token, contestId)).resolves.toBeDefined()
    })
  })

  describe('test createSubmission', () => {
    test.each([
      ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', '', 'n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', 'https://jauhar.id/'],
      [
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        '-zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6aisjd8',
        'http://jauhar.id/',
      ],
      [
        'dQRjAQKKvmA3gAeHYzLpfCs84Vjs',
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6aisjd8',
        'n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ',
        'http://jauhar.id/',
      ],
      [
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuS',
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        'http://jauhar.id/',
      ],
      ['n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', 'n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', 'n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ', ''],
      [
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        'n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ',
        'n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ',
        'justsometext',
      ],
      [
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6aisjd8',
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        'example.com',
      ],
      [
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        'http://jauhar.id/'.repeat(1024),
      ],
    ])('createSubmission should fail', async (token, problemId, languageId, sourceCode) => {
      await expect(validator.createSubmission(token, problemId, languageId, sourceCode)).rejects.toBeInstanceOf(
        ValidationError
      )
    })

    test.each([
      [
        'n7549xlQnLgYaLlWALYmrrpgEGkFDjWQ',
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        'http://jauhar.id/',
      ],
      [
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        'mzAdQRjAQKKvmA3gAeHYzLpfCs84mzAV',
        'zjA2AJP8fuWCCQaQ2jw1zcZ9xmzAuSn6',
        'ftp://jauhar.id',
      ],
    ])('createSubmission should resolved', async (token, problemId, languageId, sourceCode) => {
      await expect(validator.createSubmission(token, problemId, languageId, sourceCode)).resolves.toBeDefined()
    })
  })
})
