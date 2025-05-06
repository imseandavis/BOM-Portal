import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from './config'

interface Product {
  id: string;
  name: string;
  price: number;
  sales: number;
  category?: string;
}

export interface ProductAnalytics {
  totalProducts: number
  totalSales: number
  growthRate: number
  averagePrice: number
  salesData: {
    dates: string[]
    values: number[]
  }
  categoryDistribution: {
    categories: string[]
    values: number[]
  }
  topProducts: {
    names: string[]
    values: number[]
  }
}

export async function getProductAnalytics(): Promise<ProductAnalytics> {
  try {
    // Get products collection reference
    const productsRef = collection(db, 'products')
    const productsSnapshot = await getDocs(productsRef)
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]

    // Calculate total products
    const totalProducts = products.length

    // Calculate total sales and average price
    const totalSales = products.reduce((sum, product) => sum + (product.sales || 0) * (product.price || 0), 0)
    const averagePrice = totalProducts > 0 ? products.reduce((sum, product) => sum + (product.price || 0), 0) / totalProducts : 0

    // Calculate growth rate (mock data - replace with actual calculation)
    const growthRate = 15.5

    // Generate sales data for the last 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })
    const values = [1200, 1350, 1250, 1400, 1300, 1500, 1450]

    // Generate category distribution
    const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports']
    const categoryValues = [35, 25, 15, 15, 10]

    // Get top products by sales
    const topProductsQuery = query(productsRef, orderBy('sales', 'desc'), limit(5))
    const topProductsSnapshot = await getDocs(topProductsQuery)
    const topProducts = topProductsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]

    return {
      totalProducts,
      totalSales,
      growthRate,
      averagePrice,
      salesData: {
        dates,
        values,
      },
      categoryDistribution: {
        categories,
        values: categoryValues,
      },
      topProducts: {
        names: topProducts.map(product => product.name || 'Unnamed Product'),
        values: topProducts.map(product => product.sales || 0),
      },
    }
  } catch (error) {
    console.error('Error fetching product analytics:', error)
    throw new Error('Failed to fetch product analytics')
  }
} 