import { Product } from "../model/product"
import Image from 'next/image'

interface IProp {
    product: Product
}

function renderGambar(images: string[]){
    return images.map((gambar) => {
        return <img
            src={gambar}
            height={100}
            width={100}
        ></img>
    })
}

export default function ProductItem(prop: IProp){
    const { product } = prop
    return (
        <div>
            <a href={ product.url } target="_blank"><h3>{ product.name }</h3></a><br/>
            <div>Price : <strong>Rp. { product.price }</strong></div>
            { renderGambar(product.images) }
            <hr></hr>
        </div>
    )
}