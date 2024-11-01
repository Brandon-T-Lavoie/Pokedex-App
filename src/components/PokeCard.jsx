import {useEffect, useState} from 'react'
import { getPokedexNumber, getFullPokedexNumber } from '../utils'
import { pokemonTypeColors } from "../utils"
import TypeCard from './TypeCard'
import Modal from './Modal'

export default function PokeCard(props) {    
    const { selectedPokemon } = props
    // Set to null as the default to ensure no issue arrise.
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const[skill, setSkill] = useState(null)
    const[loadingSkill, setLoadingSkill] = useState(false)

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

    async function fetchMoveData(move, moveUrl){
        if(loadingSkill || !localStorage || !moveUrl){
            return
        }
        // Check cache for move
        let c = {}
        if (localStorage.getItem("pokemon-moves")){
            c = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if (move in c){
            setSkill(c[move])
            console.log('Found move in cahce!')
            return
        }

        setLoadingSkill(true)
        try {
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log("Fetched move from API")
            const description = moveData?.flavor_text_entries.filter(val => {
                return val.version_group.name = 'firered-leafgreen'
            })[0]?.flavor_text
            const skillData = {
                name: move,description
            }
            setSkill(skillData)
            c[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(c))
        }
        catch(e){
            console.log(e)
        }
        finally{
            setLoadingSkill(false)
        }
    }

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
            console.log('Found pokemon in cahce!')
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
                console.log(pokemonData)
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
            {/* && is If skill is true, render Modal */}
           {skill && (<Modal handleCloseModal={() => {
            // Sets skill to null making the line above false, exiting the modal
            setSkill(null)
            }}>
                <div>
                    <h6>
                        
                    </h6>
                    <h2 className='skill-name'>Name: {skill.name.replaceAll('-', ' ')}</h2>
                    <h6>
                        Description
                    </h6>
                    <p>{skill.description}</p>
                </div>
            </Modal>)}
            <h4>
                #{getFullPokedexNumber(selectedPokemon)}
            </h4>
            <h2>
                {name?.charAt(0)?.toUpperCase() + name?.slice(1)?.replaceAll('-', ' ')}
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
                    if (parseInt(moveObj?.move?.url.split("/")[6]) <= 165){
                        return(
                            <button className='button-card pokemon-move' key={moveIndex}  onClick={() => {
                                fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)}}>
                                <p>
                                    {moveObj?.move?.name?.replaceAll('-', ' ')}
                                </p>
                            </button>
                        )
                    }
                })}
            </div>
        </div>
    )
}