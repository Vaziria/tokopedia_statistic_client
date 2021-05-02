export interface Product {
    id: string
    name: string
    url: string
    images: string[]
    price: string
    stock: number
    diff_view: [number[]]
    diff_sold: [number[]]
    diff_tx: [number[]]
}