//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
// import GitHubRepos from './components/Projects';
import Skills from './components/SkillsActualizado'
import Test from './components/Proyecto'

import './css/app.css'
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {

  return (
    <div className='App'>
      <Navbar />
      <Home />
      <Skills/>
      <Test />
    </div>
  )
}

export default App;