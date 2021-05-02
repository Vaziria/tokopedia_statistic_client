import { Product } from "../model/product"
import ProductCart from "./ProductCart"

interface IProp {
    product: Product
}

function renderGambar(images: string[]){
    return images.map((gambar, index) => {
        return <img
            src={gambar}
            height={100}
            width={100}
            key={index}
        ></img>
    })
}

export default function ProductItem(prop: IProp){
    const { product } = prop
    return (
        <div>
            <hr></hr>
            <a href={ product.url } target="_blank"><h3>{ product.name }</h3></a><br/>
            <div>Price : <strong>Rp. { product.price }</strong> | <strong>Stock: { product.stock }</strong> </div>
            { renderGambar(product.images) }
            chart: 
            <div
                style={{
                    height: 500
                }}
            >
                <ProductCart
                    product={product}
                ></ProductCart>
            </div>
            
            <hr></hr>
        </div>
    )
}