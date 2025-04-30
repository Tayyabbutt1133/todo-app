import Home from "./(pages)/Home";
import Signin from "./(pages)/Signin";
import Signup from "./(pages)/Signup";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="sign-in" element={<Signin />} />
        </Routes>
    </>
  );
}

export default App;
