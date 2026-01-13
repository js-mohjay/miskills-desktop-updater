import { Link } from "react-router"

const NotFound = () => {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <h1 className="text-5xl font-semibold!">
                404 NotFound
            </h1>
            <Link to={"/"} className="text-violet-400 hover:text-violet-600 text-lg">
                Go back to Home
            </Link>

        </div>
    )
}

export default NotFound