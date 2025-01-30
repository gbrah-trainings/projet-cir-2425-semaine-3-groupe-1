import {cli} from "./connectDB.mjs"
export { /*met le nom des fonctions ici*/ };

//La ville et le rayon de dispo sont pris depuis le profil de l'utilisateur
//L'id de l'utilisteur est passé par le front avec la variable de session
//Pour l'instant c'est mit au dur le temps qu'on fasse le back
async function addNewPostInDB(idUser, isTeacher, subject, meetingPoint, complement, startDate, timetable, onlineMeeting, irlMeeting, canMove){

    try{
        const db = cli.db("posts");
        const collection = db.collection("poststest");
        let idPost = 0;
        const lastPost = await collection.find({}).sort({PostID:-1}).limit(1).toArray();
        if(lastPost.length>0){
            idPost=lastPost[0].PostID+1;
        }
        const result = await collection.insertOne({PostID: idPost, UserID: idUser, IsTeacher: isTeacher, Subject: subject, MeetingPoint: meetingPoint, Complement: complement, AreaSize: 10, City: "Roubaix", StartDate: startDate, Timetable: timetable, OnlineMeeting: onlineMeeting, IRLMeeting: irlMeeting, CanMove: canMove});
        console.log("Nouveau post banger de Plorian Poppa: ", result); 
    } catch (err){
        console.error("Erreur lors de la mise en ligne de l'annonce: ", err);
        throw err; //Remonte l'erreur
    }

    

    //Recup ville et rayon, en attendant c'est mit en dur donc normal que ça soit Roubaix et 10km à chaque fois

    
}

async function getAllPostsInDB(){
    //Récupère toutes les annonces dans la DB
    try{
        //Connexion à la DB
        const db = cli.db("posts");
        const collection = db.collection("posts");

        //Récupération de toutes les annonces
        const result = await collection.find({}).toArray();
        
        if(result){
            console.log("Annonces récupérées");
            return result;
        }
        else{
            console.log("Aucune annonce trouvée");
            return [] //On renvoit un array vide
        }
    }catch (err){
        console.error("Erreur lors de la récupération des annonces: ", err);
        throw err; //Remonte l'erreur
    }
}

async function getPostInDB(idPost){
    //Récupère l'annonce dont l'id est idPost
    try{
        //Connexion à la DB
        const db = cli.db("posts");
        const collection = db.collection("posts");

        //Récupération de l'annonce
        const result = await collection.findOne({PostID:idPost});

        //Vérification si l'annonce existe
        if (result){
            console.log("Annonce récupérée");
            return result
        } else{
            console.log("Aucune annonce trouvée avec cet id: ", idPost);
            return null
        }
    }catch (err){
        console.error("Erreur lors de la récupération de l'annonce: ", err);
        throw err; //Remonte l'erreur
    }
}

async function getReducedInfos(idUser){
    //Récupère l'id, la matière et le type des annonces de l'user idUser pour affichage dans profil

    try {
        //Connexion à la DB
        const db = cli.db("posts");
        const collection = db.collection("posts");

        //On récupère les annonces de l'utilisateur
        const result = await collection.find({UserID:idUser}, {projection: {Subject: 1, PostID: 1, IsTeacher: 1}}).toArray();

        if(result){
            console.log("Annonces récupérées");
            return result;
        }
        else{
            console.log("Aucune annonce trouvées");
            return [] //On return un array vide
        }
    
    } catch (err){
        console.log("Erreur lors de la récupération des annonces de l'utilisateur: ", err);
        throw err; //Remonte l'erreur
    }
}

async function deletePost(idPost){
    //Supprime l'annonce qui a l'id idPost

    try{
        //Connexion à la DB
        const db = cli.db("posts");
        const collection = db.collection("posts");

        //On supprime l'annonce idPost
        const result = await collection.deleteOne({PostID: idPost});

        //On vérifie si ça a marché
        if (result.deletedCount > 0) {
            console.log("L'annonce avec l'ID ${idPost} a été supprimée");
            return 1;
        } else {
            console.log("Aucune annonce trouvée avec l'ID ${idPost}");
            return 0;
        }
    } catch (err){
        console.error("Erreur lors de la suppression de l'annonce: ", err);
        throw err; //Remonte l'erreur
    }
}

async function updateCityAndArea(idUser, city, area){
    //Met à jour la ville et le rayon de déplacement de toutes les annonces de l'utilisateur

    try {
        //Connexion
        const db = cli.db("posts");
        const collection = db.collection("posts");

        //On met à jour les annonces de l'user
        const updatedFields = {City:city, AreaSize:area}; //On prépare la query
        const result = await collection.updateMany({ UserID: idUser }, { $set: updatedFields });

        if (result.modifiedCount > 0) {
            console.log("Les annonces de l'utilisateur ont été mis à jour.");
        } else {
            console.log("Aucune annonce trouvée ou aucune modification nécessaire.");
        }

    } catch (err){
        console.error("Erreur lors de la mise à jour des annonces: ", err);
        throw err; //Remonte l'erreur
    }

    
    
}

async function updatePost(idPost, isTeacher, subject, meetingPoint, complement, startDate, timetable, onlineMeeting, irlMeeting, canMove){

    try{
        const db = cli.db("posts");
        const collection = db.collection("posts");

        
        const result = await collection.updateOne({PostID: idPost}, {$set : updatedFields});
        if (result.modifiedCount > 0) {
            console.log(`Le post avec l'ID ${idPost} a été mis à jour.`);
        } else {
            console.log(`Aucun post trouvé ou aucune modification nécessaire.`);
        }
    } catch (err){
        console.error("Erreur lors de la mise à jour de l'annonce: ", err);
        throw err;
    }

    const updatedFields = {IsTeacher:isTeacher, Subject:subject, MeetingPoint:meetingPoint, Complement:complement, StartDate:startDate, Timetable:timetable, OnlineMeeting:onlineMeeting, IRLMeeting:irlMeeting, CanMove:canMove};
    
}