import { MongoClient, ServerApiVersion } from "mongodb";
const uri="mongodb+srv://userAdmin:motdepasse@mentoringdb.g9iol.mongodb.net/?retryWrites=true&w=majority&appName=MentoringDB"
const client = new MongoClient(uri);
import bcrypt from 'bcrypt';
export { client, addNewUserInDB, checkAllUsernamesInDB, deleteUserInDB, login, closeDB, clearDB, getterUser, setterUser, getAllTeacherPosts, getAllStudentPosts };



//fonction de fermeture de la connexion à la DB
async function closeDB(){
  await client.close();     //à décomenter qua-nd la connexion sera réparée
}

//Add a new user in the DB, with explicit parameters

//password is hashed before being send to the DB
//isAdmin is a boolean
//Genre is a string, "M" or "F" or "X" for other
//Be aware to use this function with await 
async function addNewUserInDB(Name, Surname, Email, Password, isAdmin, Genre, Tel, NiveauEtudes, Competences, City, Radius){
  //si l'un des paramètres est nul on retourne une erreur
  if(!Name || !Surname || !Email || !Password || !Genre || !NiveauEtudes || !City){
    console.log("Un des paramètres obligatoire est nul");
    return -1;
  }
    const db = client.db("users");
    const collection = db.collection("users");
    let creationDate= new Date();
    let idUser=0;
    //on récupère le dernier idUser
    const lastUser = await collection.findOne({}, {sort:{UserID:-1}});
    if(lastUser){
        idUser=lastUser.UserID+1;
    }
    //on vérifie si les différents éléments sont déjà utilisés
    const commonUsers=await collection.findOne({
  $or: [
    { email: Email },
    { tel: Tel }
  ]
  });
    if(commonUsers){
        console.log("Un utilisateur avec cet email ou ce numéro de téléphone existe déjà dans la base de données");
        return -1;
    }
    

        //hash password
    const hashedPassword = bcrypt.hashSync(Password, 10);

    //on récupère le dernier idUser et on l'incrémente
    let emptyArray=[];
    const result = await collection.insertOne({
                    UserID:idUser,
                    name:Name,
                    surname:Surname, 
                    email:Email, 
                    password:hashedPassword, 
                    isAdmin:isAdmin, 
                    genre:Genre, 
                    tel:Tel, 
                    niveauEtudes:NiveauEtudes, 
                    competences:Competences, 
                    city:City,
                    radiusMove:Radius,
                    nbCourses:0, 
                    nbMentorats:0,
                    postedSearchs:emptyArray, 
                    conversationsID:emptyArray,
                    accountCreation:creationDate});
    console.log("Nouvel utilisateur ajouté dans la base de données :", result);

    //fermeture de la connexion à la DB
}


async function checkAllUsernamesInDB(){
    const db = client.db("users");
    const collection = db.collection("users");
    const result = await collection.find({}).toArray();
}

async function deleteUserInDB(UserID){
    const db = client.db("users");
    const collection = db.collection("users");
    const result = await collection.deleteOne({UserID:UserID});
    console.log("Utilisateur supprimé de la base de données :", result);
  }



//Fonction de connexion
//identifiant peut être un email ou un numéro de téléphone
//password est un string
//Retourne l'UserID si la connexion est réussie, 0 si le mot de passe est incorrect, -1 si l'utilisateur n'est pas trouvé
async function login(identifiant, password){
  const db = client.db("users");
  const collection = db.collection("users");
  const user = await collection.findOne({$or: [{email:identifiant}, {tel:identifiant}]});
  if(!user){
    console.log("Utilisateur non trouvé");
    return -1;
  }
  if(user){
    if(bcrypt.compareSync(password, user.password)){
      console.log("Connexion réussie");
      return user.UserID;
    }
    else{
      console.log("Mot de passe incorrect");
      return 0;
    }
}
}
//FONCTION DE TEST QUI SUPPRIME LA TOTALITE DE LA DB, DEMANDER AVANT D'UTILISER
async function clearDB(){
  const db = client.db("users");
  const collection = db.collection("users");
  const result = await collection.deleteMany({});
  console.log("Base de données vidée :", result);
}


async function getterUser(parametre, id) {
    try {
        // Connexion à la base de données
        const db = client.db("users");
        const collection = db.collection("users");

        // Recherche de l'utilisateur avec l'ID spécifié
        const result = await collection.findOne({ UserID: id });

        // Vérification si l'utilisateur existe
        if (result) {
            // Vérifie si le paramètre demandé existe dans les données de l'utilisateur
            if (result.hasOwnProperty(parametre)) {
                console.log("Valeur du paramètre " + parametre + " : " + result[parametre]);
                return result[parametre];
            } else {
                console.log("Le paramètre" + parametre + " n'existe pas pour cet utilisateur.");
                return null;
            }
        } else {
            console.log("Aucun utilisateur trouvé avec cet ID :", id);
            return null;
        }
    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
        throw err; // Remonte l'erreur si nécessaire
    }
}

async function setterUser(parametre, valeur, id) {
    try {
        // Connexion à la base de données
        const db = client.db("users");
        const collection = db.collection("users");

        // Vérification que l'utilisateur existe
        const user = await collection.findOne({ UserID: id });
        if (!user) {
            console.log("Aucun utilisateur trouvé avec l'ID : " +id);
            return null;
        }

        // Mise à jour du champ spécifié
        const result = await collection.updateOne(
            { UserID: id }, // Recherche par ID
            { $set: { [parametre]: valeur } } // Mise à jour dynamique du paramètre
        );

        // Vérification du résultat de la mise à jour
        if (result.matchedCount > 0) {
            if (result.modifiedCount > 0) {
                console.log("Mise à jour réussie : " + parametre + " = " + valeur + " pour l'utilisateur "+ id);
            } else {
                console.log('Aucun changement effectué');
            }
        } else {
            console.log('Utilisateur introuvable.');
        }
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
        throw err;
    }
}


/* =================================== TEST SUR LA DB ============================= */

async function getAllTeacherPosts() {
  try {
      // Connexion à la base de données
      const db = client.db("users");
      const collection = db.collection("users");

      // Récupérer uniquement les `postedSearchs` des utilisateurs ayant des annonces `IsTeacher: true`
      const users = await collection.find(
          { "postedSearchs.IsTeacher": true }, // Filtrer les utilisateurs qui ont au moins une annonce `IsTeacher: true`
          { projection: { postedSearchs: 1, _id: 0, UserID: 1 } } // Ne récupérer que `postedSearchs` et `UserID`
      ).toArray();

      // Extraire toutes les annonces qui ont `IsTeacher: true`
      let teachingPosts = [];
      users.forEach(user => {
          user.postedSearchs.forEach(post => {
              if (post.IsTeacher === true) {
                  teachingPosts.push({ ...post, UserID: user.UserID });
              }
          });
      });

      if (teachingPosts.length > 0) {
          console.log("Annonces des enseignants récupérées avec succès.");
          return teachingPosts;
      } else {
          console.log("Aucune annonce trouvée pour les enseignants.");
          return [];
      }

  } catch (err) {
      console.error("Erreur lors de la récupération des annonces des enseignants :", err);
      throw err;
  }
}

async function getAllStudentPosts() {
  try {
      // Connexion à la base de données
      const db = client.db("users");
      const collection = db.collection("users");

      // Récupérer uniquement les `postedSearchs` des utilisateurs ayant des annonces `IsTeacher: false`
      const users = await collection.find(
          { "postedSearchs.IsTeacher": false }, // Filtrer les utilisateurs qui ont au moins une annonce `IsTeacher: false`
          { projection: { postedSearchs: 1, _id: 0, UserID: 1 } } // Ne récupérer que `postedSearchs` et `UserID`
      ).toArray();

      // Extraire toutes les annonces qui ont `IsTeacher: false`
      let studentPosts = [];
      users.forEach(user => {
          user.postedSearchs.forEach(post => {
              if (post.IsTeacher === false) {
                  studentPosts.push({ ...post, UserID: user.UserID });
              }
          });
      });

      if (studentPosts.length > 0) {
          console.log("Annonces des étudiants récupérées avec succès.");
          return studentPosts;
      } else {
          console.log("Aucune annonce trouvée pour les étudiants.");
          return [];
      }

  } catch (err) {
      console.error("Erreur lors de la récupération des annonces des étudiants :", err);
      throw err;
  }
}