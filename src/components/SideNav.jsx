import {first151Pokemon, getFullPokedexNumber} from "../utils"

export default function SideNav(props) {
    const {selectedPokemon, setSelectedPokemon} = props
    return(
        <nav>
            <div className={"header"}>
                <h1 className="text-gradient">Pokédex</h1>
            </div>
            <input/>
            {first151Pokemon.map((pokemon, pokemonIndex) => {
                return(
                    <button onClick={()=>{
                        setSelectedPokemon(pokemonIndex)
                    }} key={pokemonIndex} className={'nav-card ' + (pokemonIndex === selectedPokemon ? "nav-card-selected " : " ")}>
                        <p>
                            {getFullPokedexNumber(pokemonIndex)}
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