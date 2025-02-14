'use client'

import withAuth from "./withAuth"

const Layout = ({ children }) => {
    return (
        <div>
            <div className="h-screen overflow-hidden">
                {children}
            </div>
        </div>
    )
}

export default withAuth(Layout)