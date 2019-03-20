import { useEffect, useState } from 'react'
import { globalErrorCatcher, useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { Language } from './store'

export function getAvailableLanguagesAction(): AppThunkAction<Language[]> {
  return async (_dispatch, _getState, { contestService }) => {
    const languages = contestService.getAvailableLanguages()
    return languages
  }
}

export function useAvailableLanguages() {
  const dispatch = useAppThunkDispatch()
  const [languages, setLanguages] = useState(undefined as Language[] | undefined)
  useEffect(() => {
    dispatch(getAvailableLanguagesAction())
      .then(setLanguages)
      .catch(globalErrorCatcher)
  }, [])
  return languages
}
