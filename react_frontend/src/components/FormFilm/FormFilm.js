import { useState } from 'react';
import '../FormFilm/FormFilm.css';

import { useNavigate } from 'react-router-dom';

function FormFilm(){
    const genres = [
        "Action",
        "Aventure",
        "Comédie",
        "Frame",
        "Fantaisie",
        "Horreur",
        "Policier",
        "Science-Fiction",
        "Thriller",
        "Western",
    ]

    const [formData, setFormData] = useState({
        titre:"",
        description:"",
        realisation:"",
        annee:"",
        genre:[],
        titreVignette:"vide.jpg",
    })

    const [formValidity, setFromValidity] = useState("invalid");
    const navigate = useNavigate();

    function onFormDataChange(e){
        const {name, value} = e.target;

        if(name.startsWith("genre")){
            const estCoche = e.target.checked;
            let genres = formData.genre || [];

                if(!estCoche && genres.includes(value)){
                    genres = genres.filter((element,index)=>{
                        return element !== value
                    })
                }else if(estCoche && !genres.includes(value)) {
                    genres.push(value)
                }
            const donneeModifiee = { ...formData, "genres":genres };
            setFormData(donneeModifiee)
        } else if(name == "titreVignette") {
            const nomFichier = e.target.files[0].name;
            const donneeModifiee = { ...formData, titreVignette: nomFichier }
            console.log(e.target, nomFichier);
            setFormData(donneeModifiee)
        } else {
            const donneeModifiee = {...formData, [name]: value};
            setFormData(donneeModifiee)

            const estValide = e.target.form.checkValidity() ? "valid" : "invalid";
            setFromValidity(estValide)
        }
    }

    async function onFormSubmit(e){
        e.preventDefault();
        if(formValidity === "invalid"){
            e.target.reportValidity();
            return;
        }
        const data = {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                authorization: `Bearer ${localStorage.getItem("api-film")}`,
            }, 
            body:JSON.stringify(formData),
        }

        const request = await fetch("http://localhost:3301/films", data)
        const response = await request.json();

        if(request.status === 200){
            console.log("WOW such request")
            setFormData({
                titre:"",
                description:"",
                realisation:"",
                annee:"",
                genre:[],
                titreVignette:"vide.jpg",
            });
            setFromValidity("invalid")
            navigate("/")
        } else {
            const messageErreur = response.message;
            console.log("erreur", messageErreur);
        }
    }

    return(
        <div className="wrapperform">
            <h1>Ajouter un Film</h1>
            <form className={formValidity} onSubmit={onFormSubmit}>
                <div className="input-group">
                    <label htmlFor="titre">Titre</label>
                    <input 
                    type="text"
                    id="titre" 
                    name="titre" 
                    value= {formData.titre} 
                    onChange={onFormDataChange}
                    required
                    minLength={1}
                    maxLength={150}
                    ></input>
                </div>
                <div className="input-group">
                    <label htmlFor="description">Description</label>
                    <textarea 
                    type="text"
                    id="description" 
                    name="description" 
                    value= {formData.description} 
                    onChange={onFormDataChange}
                    minLength={1}
                    maxLength={500}
                    ></textarea>
                </div>
                <div className="input-group">
                    <label htmlFor="realisation">Realisation</label>
                    <input
                        type="text"
                        id="realisation"
                        name="realisation"
                        value={formData.realisation}
                        onChange={onFormDataChange}
                        required
                        minLength={1}
                        maxLength={50}
                    ></input>
                </div>
                <div className="input-group">
                    <label htmlFor="annee">annee</label>
                    <input
                        type="text"
                        id="annee"
                        name="annee"
                        value={formData.annee}
                        onChange={onFormDataChange}
                        required
                        minLength={1}
                        maxLength={10}
                    ></input>
                </div>
                <div className='input-group'>
                    <p>Genre</p>
                    {
                        genres.map((element,index)=>{
                            return (
                                <div key={index}>
                                    <input type='checkbox'
                                        id={element}
                                        name={`genre-${element}`}
                                        value={element}
                                        onChange={onFormDataChange}
                                        checked={formData.genre.includes(element)}
                                    />
                                    <label htmlFor={element}>{element}</label>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="input-group">
                    <label htmlFor="titreVignette">Vignette</label>
                    <input
                        type="file"
                        name="titreVignette"
                        id="titreVignette"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={onFormDataChange}
                    />
                </div>
                <input type="submit" value="Envoyer" disabled={formValidity == "invalid" ? "disabled" : ""}></input>
            </form>
            { <div className='erreur'></div>}
        </div>
    )

}

export default FormFilm;