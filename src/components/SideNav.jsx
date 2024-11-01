import {first151Pokemon, getFullPokedexNumber} from "../utils"
import { useState } from "react"
export default function SideNav(props) {
    const {selectedPokemon, setSelectedPokemon, handleCloseMenu, showSideMenu} = props
    const [searchValue, setSearchValue] = useState('')
    const filteredPokemon = first151Pokemon.filter((element, elementIndex) => {
        // if the full pokedex includes current search value, return true
        // if pokemon includes search name return true
        if(getFullPokedexNumber(elementIndex).includes(searchValue)){
            return true
        }
        if((element?.charAt(0)?.toUpperCase() + element?.slice(1)).includes(searchValue?.charAt(0)?.toUpperCase() + searchValue?.slice(1))){
            return true
        }
        // otherwise exclude
        return false
    })

    return(
        <nav className={' ' + (!showSideMenu ? " open" : '')}>
            <div className={"header " + (!showSideMenu ? " open" : '')}>
                <button onClick={handleCloseMenu} className="open-nav-button">
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className="text-gradient">Pokédex</h1>
            </div>
            <input placeholder="E.g. 001 or Bulbasaur" value={searchValue} onChange={(event) =>{
                setSearchValue(event.target.value)
            }}/>
            {filteredPokemon.map((pokemon, pokemonIndex) => {
                const truePokenum = first151Pokemon.indexOf(pokemon)
                return(
                    <button onClick={()=>{
                        setSelectedPokemon(truePokenum)
                        handleCloseMenu()
                    }} key={pokemonIndex} className={'nav-card ' + (pokemonIndex === selectedPokemon ? "nav-card-selected " : " ")}>
                        <p>
                            {getFullPokedexNumber(truePokenum)}
                        </p>
                        <p>
                            {pokemon}
                        </p>
                    </button>
                )
            })}
        </nav>
    )
}