import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker} from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import axios from 'axios';
import Dropzone from '../../components/Dropzone';

import './styles.css'; 

import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import logo from '../../assets/logo.svg'; 

interface item {
    id: number,
    title: string,
    image_url: string
};

interface IBGEUFResponse {
    sigla: string
};

interface IBGECityResponse {
    nome: string
};

const CreatePoint = () => {
    const [items, setItems] = useState<item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState<string>('0');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>();
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectItems, setSelectItems]= useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [resPost, setResPost] = useState<string>('initial');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude} = position.coords;

            setInitialPosition([latitude, longitude]);
        });
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(reponse => {
            const ufInitials = reponse.data.map(uf => uf.sigla); 
            
            setUfs(ufInitials);
        });
        }, []);

    useEffect(() => {
        if(selectedUf === '0') {
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => {
            const cities = response.data.map(city => city.nome);
            setCities(cities);
        });
    }, [selectedUf]);

    function handleSelectUf (event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;

        setSelectedUf(uf);
    };

    function handleSelectCity (event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectedCity(city);
    }

    function handleMapClick (event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    };

    function handleInputChange (event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;

        setFormData({...formData, [name]: value })
    };

    function handleSelectItems (id: number) {
        const alreadySelected = selectItems.findIndex(item => item === id);  
        
        if(alreadySelected >= 0) {
            const filterItems = selectItems.filter(item => item !== id);
            setSelectItems(filterItems);
        } else {
            setSelectItems([...selectItems, id]);
        }
    };
    

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const {name, email, whatsapp} = formData;
        const [latitude, longitude] = selectedPosition;
        const uf = selectedUf;
        const city = selectedCity;
        const items = selectItems;

        const data = new FormData();

            data.append('name', name);
            data.append('email', email);
            data.append('whatsapp', whatsapp);
            data.append('latitude', String(latitude));
            data.append('longitude', String(longitude));
            data.append('city', String(city));
            data.append('uf', uf);
            data.append('items', items.join(','));

            if(selectedFile) {
                data.append('image', selectedFile);
            }

       const res = await api.post('points', data);

       setResPost(res.statusText);

       setTimeout(() => {history.push('/')}, 5000);
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt=""/>
                < Link to="/">
                    < FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do<br/>ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile}/>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name" 
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email"
                                name="email" 
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                placeholder="DD999999999" 
                                name="whatsapp" 
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend> 
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onclick={handleMapClick}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={selectedPosition} zoom={15}/>
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" onChange={handleSelectUf}>
                                <option value="0"> Selecione um UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} onClick={() => handleSelectItems(item.id)} className={selectItems.includes(item.id) ? 'selected' : ''}>
                                <img src={item.image_url} alt={item.title}/>
                                 <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>          
                </fieldset>
                <button type="submit">Cadastrar ponto de coletan</button>
            </form>
            <div className={resPost.includes("initial") ? 'modal-overlay' : 'modal-overlay modal-active'}>
             {/* <div className={"modal-overlay" resPost.includes('OK') ? "overlay-active" : ''"}> */}
                <div className="overlay">
                    <div className="overlay-content">
                        <FiCheckCircle />
                        <h1>Cadastro concluído!</h1>
                        < Link to="/">
                            < FiArrowLeft />
                            Voltar para home
                        </Link>
                    </div>
                </div>                          
            </div>
        </div>
    );
};

export default CreatePoint;