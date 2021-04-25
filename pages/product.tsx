import { debounce } from 'lodash'
import { useQuery } from "@apollo/client"
import gql from "graphql-tag"
import { useState } from "react";
import ProductItem from "../components/ProductItem"

const GET_PROD = gql`
query ($search: String!){
    products(search: $search) {
        _id
        name
        price
        images
    }
}
`

export default function ProductPage(){
    
    const [ search, setSearch ] = useState('')
    const { loading, error, data, refetch } = useQuery(GET_PROD, {
        variables: {
            search
        }
    });

    let content = <span>loading....</span>
    
    if(!loading){
      content = <div>
            halaman Produk
            {   
                data.products.map((prod)=>{
                    return (
                        <ProductItem product={prod} key={prod._id}></ProductItem>
                    )
                })

                // data
                
            }
        </div>
    }

    if(error){
        content = <h1>something error ?</h1>
    }

    const textChange = debounce((e) => setSearch(e.target.value), 1000)
    return (
        <main>
            <strong>search: { search }</strong><br/>
            <input
                type="text"
                onChange={(e)=> textChange(e) }
            ></input>

            {content}
            
        </main>
    )
}