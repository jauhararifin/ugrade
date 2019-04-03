import { useRouting } from '@/routing'
import { Breadcrumbs as BPBreadcrumbs } from '@blueprintjs/core'
import { observable } from 'mobx'
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent, useEffect } from 'react'

const store = observable([] as Array<{
  url: string
  label: string
}>)

export function putItem(url: string, label: string) {
  for (const it of store) {
    if (it.url === url) {
      it.label = label
      return
    }
  }
  store.push({ url, label })
  return () => {
    store.replace(store.filter(it => it.url !== url))
  }
}

export function useBreadcrumb(url: string, label: string) {
  useEffect(() => putItem(url, label), [])
}

export const Breadcrumbs: FunctionComponent = () => {
  const routingStore = useRouting()
  return useObserver(() => {
    const items = store.slice().sort((a, b) => a.url.length - b.url.length)
    const breadcrumbWithRouter = items.map(item => ({
      text: item.label,
      onClick: () => {
        if (item.url) routingStore.push(item.url)
      },
    }))
    return <BPBreadcrumbs items={breadcrumbWithRouter} />
  })
}
