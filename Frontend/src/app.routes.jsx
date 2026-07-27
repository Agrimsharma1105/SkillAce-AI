import {createBrowserRouter} from 'react-router'
import Register from './features/auth/pages/Register'
import Login from './features/auth/pages/Login'
import ConnectApi from "./features/auth/pages/ConnectApi";
import Protected from './features/auth/components/Protected'
import Home from './features/interview/pages/Home'
import Interview from './features/interview/pages/Interview'
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
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
    path: "/connect-api",
    element: (
        <Protected>
            <ConnectApi />
        </Protected>
    )
    },  
    
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview/></Protected>
    },
    {
    path: "/privacy-policy",
    element: <PrivacyPolicy />
},
{
    path: "/terms-of-service",
    element: <TermsOfService />
},
{
    path: "/contact",
    element: <Contact />
}
])