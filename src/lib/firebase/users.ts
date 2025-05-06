import { collection, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore'
import { db } from './config'
import { ROLES } from './roles'

export interface User {
  uid: string
  email: string
  firstName?: string
  lastName?: string
  displayName?: string
  photoURL?: string
  role?: typeof ROLES[keyof typeof ROLES]
  createdAt: Timestamp
  lastLoginAt?: Timestamp
  disabled?: boolean
}

export interface UserAnalytics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  usersByRole: Record<string, number>
  userGrowth: {
    dates: string[]
    counts: number[]
  }
  lastLoginDistribution: {
    '24h': number
    '7d': number
    '30d': number
    'older': number
  }
}

export interface UserProduct {
  id: string
  type: 'domain' | 'hosting'
  name: string
  status: 'active' | 'expired' | 'pending'
  expiryDate?: Date
  createdAt: Date
  domainName?: string
  plan?: string
  storage?: number
  bandwidth?: number
}

export async function getUserAnalytics(): Promise<UserAnalytics> {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  const users = snapshot.docs.map(doc => ({
    ...doc.data(),
    uid: doc.id
  })) as User[]

  const now = new Date()
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Calculate user growth over the last 12 months
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return date
  }).reverse()

  const userGrowth = {
    dates: last12Months.map(date => date.toLocaleString('default', { month: 'short' })),
    counts: last12Months.map(date => {
      return users.filter(user => {
        const userDate = user.createdAt?.toDate()
        return userDate && 
               userDate.getMonth() === date.getMonth() && 
               userDate.getFullYear() === date.getFullYear()
      }).length
    })
  }

  // Calculate user roles distribution
  const usersByRole = users.reduce((acc, user) => {
    const role = user.role || 'no-role'
    acc[role] = (acc[role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate login activity
  const lastLoginDistribution = {
    '24h': 0,
    '7d': 0,
    '30d': 0,
    'older': 0
  }

  users.forEach(user => {
    const lastLogin = user.lastLoginAt?.toDate()
    if (!lastLogin) {
      lastLoginDistribution.older++
      return
    }

    if (lastLogin >= last24h) {
      lastLoginDistribution['24h']++
    } else if (lastLogin >= last7d) {
      lastLoginDistribution['7d']++
    } else if (lastLogin >= last30d) {
      lastLoginDistribution['30d']++
    } else {
      lastLoginDistribution.older++
    }
  })

  return {
    totalUsers: users.length,
    activeUsers: users.filter(user => {
      const lastLogin = user.lastLoginAt?.toDate()
      return lastLogin && lastLogin >= last7d
    }).length,
    newUsers: users.filter(user => {
      const createdAt = user.createdAt?.toDate()
      return createdAt && createdAt >= last30d
    }).length,
    usersByRole,
    userGrowth,
    lastLoginDistribution
  }
}

export async function getUserProducts(uid: string): Promise<UserProduct[]> {
  try {
    // Query domains collection
    const domainsRef = collection(db, 'domains')
    const domainsQuery = query(domainsRef, where('userId', '==', uid))
    const domainsSnapshot = await getDocs(domainsQuery)
    
    const domains = domainsSnapshot.docs.map(doc => {
      const data = doc.data()
      console.log('Domain data:', data)
      return {
        id: doc.id,
        type: 'domain' as const,
        name: data.domain,
        status: data.status,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        domainName: data.domain,
      }
    })

    // Query web-hosting collection
    const hostingRef = collection(db, 'web-hosting')
    const hostingQuery = query(hostingRef, where('userId', '==', uid))
    const hostingSnapshot = await getDocs(hostingQuery)
    
    const hosting = hostingSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        type: 'hosting' as const,
        name: data.plan,
        status: data.status,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        plan: data.plan,
        storage: data.storage,
        bandwidth: data.bandwidth,
      }
    })

    // Combine and sort by creation date
    return [...domains, ...hosting].sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    )
  } catch (error) {
    console.error('Error fetching user products:', error)
    return []
  }
} 