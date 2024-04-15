interface Route {
    routeName:string
    path:string,
    id:string,
    roles:string[],
    protected:boolean,
    private:boolean,
    isNavigation:boolean,
    component:React.ReactNode
}
export default Route