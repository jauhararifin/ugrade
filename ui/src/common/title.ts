import { useEffect } from 'react'
import { useWindow } from '../app'

export function title(newTitle: string = 'UGrade') {
  const ws = useWindow()
  useEffect(() => {
    ws.title = newTitle
  }, [])
}
