import React from 'react'
import datagql from '../assets/tokopedia_category.json'

interface Category {
    id: number
    name: string
    children: Category[]
}

const category: Category[] = datagql[0]["data"]["categoryAllListLite"]["categories"] as any

interface SelectItem {
    label: string,
    value: number
}

interface IState {
    active: SelectItem
}

type IProp = {
    options?: Category[]
    onChange: (value: number, options: Category[])=> any
}

class CategSelectItem extends React.Component<IProp, IState> {
    state: IState = {
        active: {
            label: 'kosong',
            value: 0
        },
    }

    get categs(): Category[] {
        if(this.props.options){
            return this.props.options
        } else {
            return category
        }
    }

    onChange(value: string){
        this.categs.map(categ => {
            if(categ.id.toString() === value){
                this.setState({
                    active: {
                        label: categ.name,
                        value: categ.id
                    }
                })

                this.props.onChange(categ.id, categ.children || [])
            }
        })
    }
    render(){
        const options: SelectItem[] = this.categs.map(categ=> {
            return {label: categ.name, value: categ.id}
        })
        
        const active = this.state.active

        return (
            <select
                onChange={(event) => {
                    this.onChange(event.target.value)
                }}
            >
                <option value="0">Kosong</option>
                { options.map( opti => {
                    return <option value={ opti.value } key={opti.value}>{ opti.label }</option>
                })}
            </select>
        )
    }
}


interface CIState {
    cat_id: number[]
    option2: Category[]
    option3: Category[]
}

interface CProp {
    onChange(cat_id: number, level: number): any
}

export default class CategSelect extends React.Component<CProp, CIState> {
    state: CIState = {
        option2: [],
        option3: [],
        cat_id: [0,0,0],
    }

    getData(cat_id: number[]): number[] {
        const ids = cat_id.filter( cat=>{
            return cat !== 0
        })
        return [ ids.length, ids[ids.length - 1]]
    }

    getLastId(cat_id: number[]): number {
        const ids = cat_id.filter( cat=>{
            return cat !== 0
        })
        return ids[ids.length - 1]
    }

    changeStateData(level: number, key: 'option2' | 'option3' | '', value: number, childs: Category[]){
        const cat_id = this.state.cat_id.map((id, index) =>{
            if(index > level){
                return 0
            }
            return id
        })
        cat_id[level] = value

        const up = {
            cat_id
        }
        if(key !== ''){
            up[key] = childs
        }
        this.setState(up)
        const [level_id, last_cat] = this.getData(cat_id)
        this.props.onChange(last_cat, level_id)
    }
    render(){
        return (
            <div>
                <CategSelectItem
                    onChange={(value, childs) => this.changeStateData(0, 'option2', value, childs)}
                ></CategSelectItem>
                <CategSelectItem
                    options={this.state.option2}
                    onChange={(value, childs) => this.changeStateData(1, 'option3', value, childs)}
                ></CategSelectItem>
                <CategSelectItem
                    options={this.state.option3}
                    onChange={(value, childs) => this.changeStateData(2, '', value, childs)}
                ></CategSelectItem>
            </div>
        )
    }
}