import { useParams } from "react-router-dom"

export function Planet(){
    const {name} = useParams()
    return <div>Ma Planete : {name}</div>
}