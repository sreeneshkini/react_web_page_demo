import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'

import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Features from './pages/Features'

const App = () => {
    return (
        <BrowserRouter>
            <div>
                <Link to="/">Home</Link><br/>
                <Link to="/aboutus">About Us</Link><br/>
                <Link to="/features">Features</Link><br/>
            </div>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/aboutus">
                    <AboutUs />
                </Route>
                <Route path="/features">
                    <Features />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default App