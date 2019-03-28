import { useWindow } from '@/app'
import { useEffect } from 'react'

export function title(newTitle: string = 'UGrade') {
  const ws = useWindow()
  useEffect(() => {
    ws.title = newTitle
  }, [])
}
