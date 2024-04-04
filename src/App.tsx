import './App.css'
import { AuthProvider } from './providers/authContext'
import Skeleton from './skeleton/skeleton'



function App() {
  

  return (
  <AuthProvider>
    <Skeleton/> 
  </AuthProvider>
    

  )
}

export default App
