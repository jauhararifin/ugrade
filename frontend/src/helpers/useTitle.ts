import { useEffect } from 'react'
import { useDispatch } from 'redux-react-hook'

import { setTitle } from '../stores/Title'

export default function useTitle(title: string) {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setTitle(title))
  }, [])
}
