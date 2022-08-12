import './App.css';
import Nav from './Components/Nav';
import Home from './Components/Home';
import Footer from './Components/Footer';
import Explore from './Components/explore/Explore';
import Mypage from './Components/Mypage';
import MintNft from "./Components/MintNft";
import SellRegistration from './Components/SellRegistration';
import BuyNFT from './Components/BuyNFT';
import ProceedManage from './Components/ProceedManage';

import {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [mainweb3, setMainweb3] = useState("");
  const [mainAccount, setMainAccount] = useState("Address not yet");
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setMainAccount(mainAccount);
  }, [mainAccount]);

  useEffect(() => {
    if (
      mainAccount === "Address not yet" ||
      mainAccount === undefined ||
      mainAccount === null
    ) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [mainAccount]);

  return (
       <BrowserRouter>
        <Nav
            setmainaccount={setMainAccount}
            setmainweb3={setMainweb3}
            setislogin={setIsLogin}
            login={isLogin}
        />
        <Routes>
            <Route exact={true} path="/" 
            element={<Home 
            setmainaccount={setMainAccount}
            setmainweb3={setMainweb3} />} />
            <Route path="/explore" element={<Explore  />} />
                      
        </Routes>
        <div><Footer /></div>
       </BrowserRouter>
    );
}

export default App;
