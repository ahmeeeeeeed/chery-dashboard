import React from 'react'
import './NotFound.css'
import { useHistory,useLocation } from "react-router-dom";

export default function  NotFound  (){

    let history = useHistory()
    let location = useLocation();
       console.log(location)   

    const retourner = ()=>{
        history.push('/dashboard')
    }

    return (
        
        <div id="notfound">
		<div className="notfound">
			<div className="notfound-404">
				<h1>Oops!</h1>
			</div>
			<h2>404 - Page non trouvée !</h2>
			<p>La page que vous recherchez est temporairement indisponible.</p>
			<a onClick={retourner} >Retourner vers la première page</a>
		</div>
	</div>
    )
}