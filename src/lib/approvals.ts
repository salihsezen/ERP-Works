import { useEffect, useMemo, useState } from 'react'

type EntityType = 'invoice' | 'purchase_order'
type ApprovalAction = 'approved' | 'rejected'
type ApprovalState = 'pending' | ApprovalAction

type HistoryEntry = {
  action: ApprovalAction
  timestamp: string
}

type ApprovalRecord = Record<string, HistoryEntry[]>

const STORAGE_KEY = 'innobi-approvals'

const makeKey = (entity: EntityType, id: number) => `${entity}:${id}`

const loadApprovals = (): ApprovalRecord => {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ApprovalRecord) : {}
  } catch {
    return {}
  }
}

const persistApprovals = (data: ApprovalRecord) => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const getApprovalHistory = (entity: EntityType, id: number): HistoryEntry[] => {
  const data = loadApprovals()
  return data[makeKey(entity, id)] || []
}

export const getApprovalState = (entity: EntityType, id: number): ApprovalState => {
  const history = getApprovalHistory(entity, id)
  if (history.length === 0) return 'pending'
  return history[history.length - 1].action
}

export const recordApproval = (
  entity: EntityType,
  id: number,
  action: ApprovalAction,
  timestamp: string = new Date().toISOString()
) => {
  const data = loadApprovals()
  const key = makeKey(entity, id)
  const history = data[key] || []
  data[key] = [...history, { action, timestamp }]
  persistApprovals(data)
}

// Lightweight hook to get reactive approval state per entity
export const useApprovalState = <T extends { id: number }>(entity: EntityType, items: T[]) => {
  const [version, setVersion] = useState(0)

  // Refresh when items change to ensure keys exist
  useEffect(() => {
    setVersion(v => v + 1)
  }, [items])

  const approvals = useMemo(() => {
    return items.reduce<Record<number, { state: ApprovalState; lastUpdated?: string }>>((acc, item) => {
      const history = getApprovalHistory(entity, item.id)
      const last = history[history.length - 1]
      acc[item.id] = {
        state: history.length === 0 ? 'pending' : last.action,
        lastUpdated: last?.timestamp
      }
      return acc
    }, {})
  }, [entity, items, version])

  const setApproval = (id: number, action: ApprovalAction) => {
    recordApproval(entity, id, action)
    setVersion(v => v + 1)
  }

  return { approvals, setApproval }
}
