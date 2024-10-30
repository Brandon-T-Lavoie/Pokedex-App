import {useEffect, useState} from 'react'
import { getPokedexNumber, getFullPokedexNumber } from '../utils'
import TypeCard from './TypeCard'

export default function PokeCard(props) {    
    const { selectedPokemon } = props
    // Set to null as the default to ensure no issue arrise.
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    // destructure out of data or an empty object if data not found
    const {name, height, abilities, stats, types, moves, sprites} = data || {}

    const imgList = Object.keys(sprites || {}).filter(val => {
        // filters out undefined
        if(!sprites[val]) {
            return false
        }
        // filters out the key word sprites versions and other
        if (['versions', 'other'].includes(val)){
            return false
        }
        // return the api sprite images
        return true
    })

    // When selected pokemon changes execute {}
    useEffect(() => {

        // How to make sure that you don't get banned from API! Only do if information changes
        // infrequently.

        // if loading or we don't have access to localStorage, exit logic.
        if(loading || !localStorage) {
            return
        }
        
        // check if cache already has information
        // 1. define cache
        let cache = {}
        if (localStorage.getItem('pokedex')){
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }
        
        // 2. check if selected pokemon is in cache. otherwise fetch from api
        if(selectedPokemon in cache){
            // read from cache
            setData(cache[selectedPokemon])
            return
        }

        // passed all cache and didn't fine quary. Now fetch from api.
        async function fetchPokemonData(){
            try{
                const baseUrl = "https://pokeapi.co/api/v2/"
                const suffix = "pokemon/" + getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                // Update screen with pokeData
                setData(pokemonData)
                console.log("Fetched Pokemon Data")

                // Cache info for future quick use
                cache[selectedPokemon] = pokemonData
                // Update Cache with new info
                localStorage.setItem('pokedex',JSON.stringify(cache))
            }
            catch(e){
                console.log(e.message)
            }
            finally{
                setLoading(false)
            }

        }
        // if fetch from api save info to cache for future use.
        fetchPokemonData()

    }, [selectedPokemon])

    if(loading || !data){
        return(
            <div>
                <h4>
                    Loading...
                </h4>
            </div>
        )
    }

    return(
        <div className="poke-card">
            <h4>
                #{getFullPokedexNumber(selectedPokemon)}
            </h4>
            <h2>
                {name}
            </h2>
            <div className='type-container'>
                {types.map((typeObj, typeIndex) => {
                    return(
                        <TypeCard key={typeIndex} type={typeObj?.type?.name}/>
                    )
                })}
            </div>
            <img className='default-img' src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt={`${name}-large-img`}/>
            
            <div className='img-container'>
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    return(
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                    )
                })}
            </div>

            <h3>Stats</h3>
            
            <div className='stats-card'>
                {stats.map((statObj, statIndex) => {
                    const { stat, base_stat } = statObj
                    return (
                        <div key={statIndex} className='stat-item'>
                            <p>{stat?.name.replaceAll('-', ' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                })}
            </div>
            <h3>Moves</h3>
            <div className='pokemon-move-grid'>
                {moves.map((moveObj, moveIndex) => {
                    return(
                        <button className='button-card pokemon-move' key={moveIndex} onClick={() => { }}>
                            <p>
                                {moveObj?.move?.name?.replaceAll('-', ' ')}
                            </p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}