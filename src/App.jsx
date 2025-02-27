import React, { useState, useEffect } from "react";
import axios from "axios";
import BeerCard from "./BeerCard";
import "./App.css";
import {SkipNext, SkipPrevious} from "@mui/icons-material";
import {Alert, CircularProgress} from "@mui/material";

function App() {
    const [beers, setBeers] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const beersPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await axios.get("https://api.sampleapis.com/beers/ale")
                    .then(r => {
                        if(!r.data?.error) {
                            setBeers(r.data);
                        } else setError(r.data.message || "Error fetching data")
                    });
            } catch (err) {
                console.error(err);
                setError("Some Error Occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    if(loading) {
        return <div style={{display: 'flex', justifyContent: 'center', width: '100vw'}}>
            <CircularProgress style={{color: 'aliceblue'}}/>
        </div>
    }

    if(error) {
        return <Alert icon={false} style={{display: 'flex', justifyContent: 'center', width: '100vw', height: '100vh', background: '#181818', fontSize: 'x-large'}} severity="error">
            {error}
        </Alert>
    }

    const filteredBeers = beers.filter((beer) =>
        beer.name.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastBeer = currentPage * beersPerPage;
    const indexOfFirstBeer = indexOfLastBeer - beersPerPage;
    const currentBeers = filteredBeers.slice(indexOfFirstBeer, indexOfLastBeer);

    const totalPages = Math.ceil(filteredBeers.length / beersPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="App">
            <div className="cont">
                <h1>Beer Search</h1>
                <input
                    type="text"
                    placeholder="Search for beers"
                    value={search}
                    onChange={handleSearch}
                />
                <div className="beer-cards">
                    {currentBeers.map((beer) => (
                        <BeerCard key={beer.id} beer={beer}/>
                    ))}
                </div>
                <div className="box">
                    <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage === 1}><SkipPrevious/></button>
                        <span className="page-number">Page {currentPage} of {totalPages}</span>
                        <button onClick={nextPage} disabled={currentPage === totalPages}><SkipNext/></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;