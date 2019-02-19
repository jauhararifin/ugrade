export const getSourceCodeFromUrl = async (sourceCodeUrl: string) => {
  try {
    const result = await fetch(sourceCodeUrl)
    return result.text()
  } catch (error) {
    throw new Error(`Cannot Fetch Source Code Content: ${error}`)
  }
}
