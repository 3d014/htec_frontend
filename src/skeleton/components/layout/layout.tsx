import  { ReactNode } from "react"

const Layout=({ children }: { children: ReactNode })=>{


    return <div style={{background:"black"}}>{children}</div>
}
export default Layout