interface Brand {
    id: number
    name: string
    description: string
}

export interface Watch {
    id: number
    name: string
    brand: Brand
    description: string
    price: string
    watch_type: string
    image: string
    in_stock: boolean
    created_at: string
}