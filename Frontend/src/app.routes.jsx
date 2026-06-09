import {createBrowserRouter} from 'react-router'
import Register from './features/auth/pages/Register'
import Login from './features/auth/pages/Login'
import Protected from './features/auth/components/Protected'
import Home from './features/interview/pages/Home'
import Interview from './features/interview/pages/Interview'
export const router = createBrowserRouter([
    {
        path:'/register',
        element:<Register/>
    },
    {
        path:'/login',
        element: <Login/>
    },
    {
        path:'/',
        element:<Protected><Home/></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview/></Protected>
    }
])