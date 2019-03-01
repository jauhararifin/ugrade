import { useEffect } from 'react'
import { useDispatch } from 'redux-react-hook'
import { setTitle } from 'ugrade/common/title/store'

export function useTitle(title: string) {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setTitle(title))
  })
}
