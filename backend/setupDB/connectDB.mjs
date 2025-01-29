import { MongoClient, ServerApiVersion } from "mongodb";
const uri="mongodb+srv://userAdmin:motdepasse@mentoringdb.g9iol.mongodb.net/?retryWrites=true&w=majority&appName=MentoringDB"
const client = new MongoClient(uri);
import bcrypt from 'bcrypt';
export { client, addNewUserInDB, checkAllUsernamesInDB, deleteUserInDB, login, closeDB, clearDB, getterUser, setterUser };



//fonction de fermeture de la connexion à la DB
async function closeDB(){
  await client.close();     //à décomenter quand la connexion sera réparée
}

//Add a new user in the DB, with explicit parameters

//password is hashed before being send to the DB
//isAdmin is a boolean
//Genre is a string, "M" or "F" or "X" for other
//Be aware to use this function with await 
async function addNewUserInDB(Name, Surname, Email, Password, isAdmin, Genre, Tel, NiveauEtudes, Competences, City, Radius){
  //si l'un des paramètres est nul on retourne une erreur
  console.log("coucou")
  if(!Name || !Surname || !Email || !Password || !Genre || !NiveauEtudes || !City){
    console.log("Un des paramètres obligatoire est nul");
    return -1;
  }
    const db = client.db("users");
    console.log("ez")
    const collection = db.collection("users");
    
      console.log("ez2")
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
  await closeDB();
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
console.log("bonjour ?")

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
            console.log('Utilisateur pas trouvé.');
        }
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
        throw err;
    }
}

/* =================================== TEST SUR LA DB ======================= */
console.log("hello")
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
  "Paris",
  10
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
  "Lyon",
  20
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
  "Marseille",
  15
);

await addNewUserInDB(
  "Alex",
  "Moreau",
  "alex.moreau@email.com",
  "Passw0rd!",
  false,
  "X",
  "0688776655",
  "BTS",
  ["C++", "Embedded Systems"],
  "Toulouse",
  30
);

await addNewUserInDB(
  "Emma",
  "Rousseau",
  "emma.rousseau@email.com",
  "TrickyPass99",
  false,
  "F",
  "0677889900",
  "BAC+5",
  ["UX/UI Design", "Figma", "Adobe XD"],
  "Bordeaux",
  25
);

await addNewUserInDB(
  "Nathan",
  "Dubois",
  "nathan.dubois@email.com",
  "SuperSecure123",
  false,
  "M",
  "0655443322",
  "Master",
  ["Cybersecurity", "Ethical Hacking"],
  "Lille",
  50
);
