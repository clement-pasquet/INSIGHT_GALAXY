import { useRouteError } from "react-router-dom"

export function ErrorPage(){
    const error = useRouteError()
    return <div>
        La page que vous essayer de rejoindre n'existe pas !
        <p>
            {error?.error?.toString() ?? error?.toString()}
        </p>
    </div>
}