import { debounce } from 'lodash'
import { useQuery } from "@apollo/client"
import gql from "graphql-tag"
import { ChangeEventHandler, useState } from "react"
import ProductItem from "../components/ProductItem"
import CategorySelect from "../components/CategorySelect"

const GET_PROD = gql`
query ($filter: ProductFilter!){
    product_count
    products(filter: $filter){
        _id
        name
        price
        stock
        images

        diff_sold
        diff_tx
        diff_view

        sold_day_1
        sold_day_3
        sold_week
        sold_week_2
        sold_month

        tx_day_1
        tx_day_3
        tx_week
        tx_week_2
        tx_month

        view_day_1
        view_day_3
        view_week
        view_week_2
        view_month
    }
}
`

interface PriceRangeProp {
    value: string[],
    onChange: (data: string[]) => any

}
function PriceRange(prop: PriceRangeProp){
    const price = prop.value
    const onChange = prop.onChange
    return <div>
        pricemin: 
        <input
            value={price[0]}
            onChange={(e) => onChange([e.target.value, price[1]])}
        ></input>
        pricemax: 
        <input
            value={price[1]}
            onChange={(e) => onChange([price[0], e.target.value])}
        ></input>
    </div>
}

function SelectSort(props: { value: string, onchange: ChangeEventHandler<HTMLSelectElement>}){
    const keys = [
        'sold_day_1',
        'sold_day_3',
        'sold_week',
        'sold_week_2',
        'sold_month',
        'stock',
        'tx_day_1',
        'tx_day_3',
        'tx_week',
        'tx_week_2',
        'tx_month',
        'view_day_1',
        'view_day_3',
        'view_week',
        'view_week_2',
        'view_month'
    ]
    return (
        <select
            value={props.value}
            onChange={props.onchange}
        >
            { keys.map(key => {
                return (
                    <option value={ key } key={key}>{ key }</option>
                )
            })}
        </select>
    )
}

export default function ProductPage(){
    const limit = 30

    const [ search, setSearch ] = useState('')
    const [ sort, setSort ] = useState('sold_day_3')
    const [ price, setPrice ] = useState(['', ''])
    const [ offset, setOffset ] = useState(0)
    const [ cat_id, setCatId ] = useState(0)
    const [ cat_level, setCatLevel ] = useState(0)

    let filter: any = {
        search,
        sort,
        limit,
        offset,
    }

    if(cat_id !== 0){
        filter = { ...filter, cat_id: cat_id.toString() }
    }

    if(cat_level !== 0){
        filter = { ...filter, cat_level: cat_level }
    }

    const { loading, error, data, refetch } = useQuery(GET_PROD, {
        variables: {
            filter,
        }
    });

    let backbutton = null
    if(offset > 0){
        backbutton = <button
            onClick={()=> setOffset( offset - limit )}
        >back</button>
    }

    let nextbutton = null
    if(offset < 300){
        nextbutton = <button
        onClick={()=> setOffset( offset + limit )}
    >next</button>
    }


    let content = <span>loading....</span>
    
    if(!loading){
      content = <div>
            total semua produk : <strong>{ data.product_count }</strong><br />
            halaman Produk
            {   
                data.products.map((prod)=>{
                    return (
                        <ProductItem product={prod} key={prod._id}></ProductItem>
                    )
                })

                // data
            }

            { backbutton } | { nextbutton } 
            
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
            <br/>

            <SelectSort
                value={sort}
                onchange={(e) => setSort(e.target.value)}
            ></SelectSort>
            <PriceRange
                value={price}
                onChange={(price)=>setPrice(price)}
            ></PriceRange>
            select kategory: 
            <CategorySelect
                onChange={(cat_id, level)=>{
                    setCatId(cat_id)
                    setCatLevel(level)
                }}
            ></CategorySelect>
            id: { cat_id } | level : { cat_level }

            {content}
            
        </main>
    )
}