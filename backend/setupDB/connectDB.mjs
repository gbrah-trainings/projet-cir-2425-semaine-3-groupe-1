import { MongoClient, ServerApiVersion } from "mongodb";
const uri="mongodb+srv://userAdmin:motdepasse@mentoringdb.g9iol.mongodb.net/?retryWrites=true&w=majority&appName=MentoringDB"
const client = new MongoClient(uri);
import bcrypt from 'bcrypt';
export { client, addNewUserInDB, checkAllUsernamesInDB, deleteUserInDB };



//fonction de fermeture de la connexion à la DB
async function closeDB(){
  await client.close();
}

//Add a new user in the DB, with explicit parameters
//password is hashed before being send to the DB
//isAdmin is a boolean
//Genre is a string, "M" or "F" or "X" for other
//Be aware to use this function with await 
async function addNewUserInDB(Name, Surname, Email, Password, isAdmin, Genre, Tel, NiveauEtudes, Competences, City){
  //si l'un des paramètres est nul on retourne une erreur
  if(!Name || !Surname || !Email || !Password || !Genre || !Tel || !NiveauEtudes || !Competences || !City){
    console.log("Un des paramètres est nul");
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
                    nbCourses:0, 
                    nbMentorats:0,
                    postedSearchs:emptyArray, 
                    conversationsID:emptyArray,
                    accountCreation:creationDate});
    console.log("Nouvel utilisateur ajouté dans la base de données :", result);

    //fermeture de la connexion à la DB
    await closeDB();
}



async function checkAllUsernamesInDB(){
    const db = client.db("users");
    const collection = db.collection("users");
    const result = await collection.find({}).toArray();
    await closeDB();
}

async function deleteUserInDB(UserID){
    const db = client.db("users");
    const collection = db.collection("users");
    const result = await collection.deleteOne({UserID:UserID});
    console.log("Utilisateur supprimé de la base de données :", result);
  await closeDB();
  }


//Cette fonction n'est pas destinée à rester, elle sert simplement à utiliser des fonctions await au top level pour les tests
//Elle ajoute des utilisateurs exemples dans la DB
await addNewUserInDB(
  "Alice",
  "Dupont",
  "alice.dupont@email.com",
  "SecurePass123",
  false,
  "F",
  "0601020304",
  "Master",
  ["JavaScript", "React", "Node.js"],
  "Paris"
);

await addNewUserInDB(
  "Martin",
  "Lefevre",
  "martin.lefevre@email.com",
  "StrongPwd456",
  false,
  "M",
  "0612345678",
  "Licence",
  ["Python", "Django", "SQL"],
  "Lyon"
);

await addNewUserInDB(
  "Sophie",
  "Lambert",
  "sophie.lambert@email.com",
  "MySuperPass789",
  true,
  "F",
  "0698765432",
  "Doctorat",
  ["Machine Learning", "TensorFlow", "Big Data"],
  "Marseille"
);



//FONCTION DE TEST QUI SUPPRIME LA TOTALITE DE LA DB, DEMANDER AVANT D'UTILISER
async function clearDB(){
  const db = client.db("users");
  const collection = db.collection("users");
  const result = await collection.deleteMany({});
  console.log("Base de données vidée :", result);
  await closeDB();
}

await closeDB();
//clearDB();

