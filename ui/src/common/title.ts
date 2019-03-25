import { observable } from 'mobx'
import { useObservable } from 'mobx-react-lite'
import { useEffect } from 'react'

export class TitleStore {
  @observable title: string = 'UGrade'
}

export const titleStore = new TitleStore()

export function useTitle() {
  return useObservable(titleStore)
}

export function title(newTitle: string = 'UGrade') {
  const st = useTitle()
  useEffect(() => {
    st.title = newTitle
  }, [])
}
