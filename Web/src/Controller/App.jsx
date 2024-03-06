import React from 'react';
import {RouterProvider, createBrowserRouter,NavLink,Outlet} from 'react-router-dom'
import {Home} from '../View/Home';
import {About} from '../View/About';
import {Credits} from '../View/Credits';
import { Planet } from '../View/Planet';
import { ErrorPage } from '../View/ErrorPage';


const router = createBrowserRouter([
  {path:'/',
  element:<Root/>,
  errorElement:<ErrorPage/>,
  children:[
    {path:'Home',element:<Home/>},
    {path:'Credits',element:<Credits/>},
    {path:'About',element:<About/>},
    {path:'Planet/:name',element:<Planet/>}
  ]

  },
  


])

function Root(){
  return <>
    <header>
      <nav>
        <NavLink to="/Home">Home</NavLink>
        <NavLink to="/About">About</NavLink>
        <NavLink to="/Credits">Credits</NavLink>
        <NavLink to="/Planet/tatooine">Example</NavLink>

      </nav>
    </header>
    <div><Outlet/></div>


  </>
}

function App() {
  return <RouterProvider router={router}/>
}

export default App;
