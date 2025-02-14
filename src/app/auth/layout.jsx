'use client'

const Layout = ({ children }) => {
    return (
        <div>
            <div className="h-screen bg-black overflow-hidden">
                {children}
            </div>
        </div>
    )
}

export default Layout