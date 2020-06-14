import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { FiLogIn, FiSearch } from 'react-icons/fi';


import logo from '../../assets/logo.svg';
import { DomUtil } from 'leaflet';

const Home = () => {
    const [overlayActive, setOverlayActive] = useState('');

    function handleOverlay(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if(overlayActive === 'active') {
            setOverlayActive('');
        } else {
            setOverlayActive('active');
        }   
    }

    return (
       <div id="page-home">
           <div className="content">
            <header>
                <img src={logo} alt=""/>
                < Link to="/create-point">
                    <span>
                        <FiLogIn />
                    </span>
                    <strong>Cadastre um ponto de coleta</strong>
                </Link>
            </header>
            <main>
                <h1>Seu marketplace de coleta de resíduos</h1>
                <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</p>
                <button onClick={handleOverlay}>
                    <span>
                        <FiSearch />
                    </span>
                    <strong>Pesquisar pontos de coleta</strong>
                </button>
            </main>
            <div className={overlayActive === 'active' ? "overlay-content active" : "overlay-content"}>
                <h1>Pontos de coleta</h1>
                <form>
                    <input 
                        type="text"
                        placeholder="Escolha uma UF"
                        name="ufs"
                    />
                    <input
                        type="text"
                        placeholder="Escolha uma cidade"
                        name="cities"
                    />
                    <button className="button">Buscar</button>
                </form>
            </div>
           </div>
       </div> 
    );
};

export default Home;