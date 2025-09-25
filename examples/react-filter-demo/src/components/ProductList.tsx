import { Package } from 'lucide-react'
import type { Filters } from '../App'

interface Product {
  id: number
  name: string
  category: string
  price: number
  dateAdded: string
  description: string
  tags: string[]
}

interface ProductListProps {
  filters: Filters
}

// Sample product data for demonstration
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'electronics',
    price: 199,
    dateAdded: '2024-01-15',
    description: 'High-quality wireless headphones with noise cancellation',
    tags: ['audio', 'wireless', 'premium']
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    category: 'clothing',
    price: 29,
    dateAdded: '2024-02-01',
    description: 'Comfortable 100% cotton t-shirt in various colors',
    tags: ['cotton', 'casual', 'comfort']
  },
  {
    id: 3,
    name: 'JavaScript Programming Book',
    category: 'books',
    price: 45,
    dateAdded: '2024-01-20',
    description: 'Learn modern JavaScript programming techniques',
    tags: ['programming', 'education', 'web']
  },
  {
    id: 4,
    name: 'Garden Hose',
    category: 'home',
    price: 35,
    dateAdded: '2024-02-10',
    description: '50ft expandable garden hose with spray nozzle',
    tags: ['garden', 'outdoor', 'water']
  },
  {
    id: 5,
    name: 'Running Shoes',
    category: 'sports',
    price: 120,
    dateAdded: '2024-01-30',
    description: 'Lightweight running shoes with cushioned sole',
    tags: ['running', 'athletic', 'footwear']
  },
  {
    id: 6,
    name: 'LEGO Building Set',
    category: 'toys',
    price: 89,
    dateAdded: '2024-02-05',
    description: 'Creative building set with 500+ pieces',
    tags: ['building', 'creative', 'kids']
  },
  {
    id: 7,
    name: 'Smartphone',
    category: 'electronics',
    price: 699,
    dateAdded: '2024-01-25',
    description: 'Latest smartphone with advanced camera features',
    tags: ['mobile', 'camera', 'technology']
  },
  {
    id: 8,
    name: 'Yoga Mat',
    category: 'sports',
    price: 39,
    dateAdded: '2024-02-08',
    description: 'Non-slip yoga mat for all types of workouts',
    tags: ['yoga', 'fitness', 'exercise']
  }
]

export function ProductList({ filters }: ProductListProps) {
  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      
      if (!matchesSearch) return false
    }

    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false
    }

    // Price range filter
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false
    }

    // Date range filter
    if (filters.dateFrom && product.dateAdded < filters.dateFrom) {
      return false
    }
    if (filters.dateTo && product.dateAdded > filters.dateTo) {
      return false
    }

    return true
  })

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>Products ({filteredProducts.length})</h2>
        {filteredProducts.length === 0 && (
          <p className="no-products">No products match your current filters.</p>
        )}
      </div>
      
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-icon">
              <Package size={24} />
            </div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price}</p>
            <p className="product-description">{product.description}</p>
            <div className="product-meta">
              <span className="product-category">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
              <span className="product-date">Added: {product.dateAdded}</span>
            </div>
            <div className="product-tags">
              {product.tags.map(tag => (
                <span key={tag} className="product-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}