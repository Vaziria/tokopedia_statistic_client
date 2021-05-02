import { ResponsiveBar } from '@nivo/bar'
import { Product } from '../model/product'

interface IProps {
    product: Product
}

interface CartData {
    tanggal: number
    sold: number
    tx: number
    view: number
    soldColor: string
    txColor: string
    viewColor: string
}

type CartDataKey = keyof Pick<CartData, 'sold' | 'tx' | 'view'>

function mapped_diff(product: Product): CartData[]{
    const diff_view = product.diff_view
    const diff_sold = product.diff_sold
    const diff_tx = product.diff_tx

    const warna: Pick<CartData, 'soldColor' | 'txColor' | 'viewColor'> = {
        soldColor: "hsl(16, 70%, 50%)",
        txColor: "hsl(328, 70%, 50%)",
        viewColor: "hsl(217, 70%, 50%)"
    }

    const hasil: CartData[] = diff_sold.map((sold, index) => {
        return {
            ...warna,
            tanggal: sold[0],
            sold: sold[1],
            tx: diff_tx[index][1],
            view: diff_view[index][1],
        }
    })

    return hasil
}

export default function ProductCart(props: IProps){

    const product = props.product
    const data = mapped_diff(product)
    const key: CartDataKey[] = ['sold', 'tx', 'view'] 

    return (<ResponsiveBar
    data={data}
    keys={key}
    indexBy="tanggal"
    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    padding={0}
    innerPadding={1}
    groupMode="grouped"
    valueScale={{ type: 'linear' }}
    indexScale={{ type: 'band', round: true }}
    colors={{ scheme: 'nivo' }}
    defs={[
        {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: '#38bcb2',
            size: 4,
            padding: 1,
            stagger: true
        },
        {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: '#eed312',
            rotation: -45,
            lineWidth: 6,
            spacing: 10
        }
    ]}
    borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'tanggal',
        legendPosition: 'middle',
        legendOffset: 32
    }}
    axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'jumlah',
        legendPosition: 'middle',
        legendOffset: -40
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
    legends={[
        {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
                {
                    on: 'hover',
                    style: {
                        itemOpacity: 1
                    }
                }
            ]
        }
    ]}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
/>)
}
