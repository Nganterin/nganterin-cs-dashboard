import Navbar from "@/components/Navbar"

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <div className="h-[calc(100vh-53px)] overflow-hidden">
                {children}
            </div>
        </div>
    )
}

export default Layout