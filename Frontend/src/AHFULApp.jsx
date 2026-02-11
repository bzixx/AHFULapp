import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./src/pages/Home/Home.jsx";
import { Layout } from "./layout.jsx";
import "./siteStyles.css";

function AHFULApp() {
  return (
  <Router>
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<Home/>}/>
      </Route>
    </Routes>
  </Router>
  )
}

export default AHFULApp