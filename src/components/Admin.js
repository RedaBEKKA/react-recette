import React ,{Component} from 'react';
import AjouterRecette from './AjouterRecette'
import AdminForm from './AdminForm'
import firebase from 'firebase/app'
import 'firebase/auth'
import base,{firebaseApp} from '../base'
import Login from './Login'


class Admin extends Component{
   state={
       uid:null,
       chef:null
   }

   componentDidMount(){
       firebase.auth().onAuthStateChanged(user =>{
           if(user){
               this.handleAuth({user})
           }
       })
   }

   handleAuth = async authdata =>{
      const box = await base.fetch(this.props.pseudo,{context:this})
      if(!box.chef){
          await base.post(`${this.props.pseudo}/chef`,{
              data:authdata.user.uid
          })
      }
      this.setState({
          uid:authdata.user.uid,
          chef:box.chef || authdata.user.uid
      })
   }

   authenticate = () =>{
       const authProvider = new firebase.auth.FacebookAuthProvider()
    firebaseApp
     .auth()
     .signInWithPopup(authProvider)
     .then(this.handleAuth)
   }

   logout = async () =>{
        console.log('Deconnexion')
        await firebase.auth().signOut()//se deconnecter
        this.setState({uid:null})
   }
    render(){
        const {ajouterRecette,majRecette,chargerExemple,recettes,supprimerRecette} =this.props
        const logout =<button onClick={this.logout}>Déconnexion</button>
        //si user n'est pas connecté
        if(!this.state.uid){
            return <Login authenticate={this.authenticate}></Login>
        }

        if(this.state.uid !== this.state.chef){
          return(
            <div>
                <p>Tu n'es pas le chef de cette boite !!</p>
                {logout}
             </div>
          )
        }


        
        return (
            <div className="cards">
                <AjouterRecette ajouterRecette={ajouterRecette}/>
                 
                {
                       Object.keys(recettes)
                       .map(key => <AdminForm
                        majRecette={majRecette}
                        recettes={recettes}
                        supprimerRecette={supprimerRecette}
                        key={key}
                        id={key}
                       >

                       </AdminForm>)
                   } 
                
                <footer>
                    {logout}
                <button onClick={chargerExemple}>Remplir</button>
                </footer>
            </div>
        );
    }
  
};

export default Admin;