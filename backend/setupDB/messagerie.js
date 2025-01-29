const { MongoClient, ServerApiVersion } = require('mongodb');
const uri="mongodb+srv://userAdmin:motdepasse@mentoringdb.g9iol.mongodb.net/?retryWrites=true&w=majority&appName=MentoringDB"
const client = new MongoClient(uri);
const bcrypt = require('bcrypt');

async function createConv(IDExpediteur, IDDestinataire, message, IDProf, IDEleve){
    const db = client.db("conversations");
    const Conversation = db.collection("conversations");

    let creationDate = new Date();

    let idConv = 0

    const existingConversation = await Conversation.findOne({IDProf : IDProf, IDEleve : IDEleve});

    //if(await Conversation.countDocuments({Messages: {$exists : true}, IDProf : IDProf, IDEleve : IDEleve})){
    if(existingConversation){

        const messageCount = Object.keys(existingConversation.Messages).length;
        const newMessageKey = messageCount + 1;
        
        let NewMessage = (({
            "user" : IDExpediteur,
            "timeSent" : creationDate,
            "content" : message
        }))

        const result = await Conversation.updateOne(
            {_id: existingConversation._id},
            {$set : {[`Messages.${messageCount}`] : NewMessage}});

        console.log("Nouveau message ajoutée");
    }
    else{

        const initialMessageKey = 0;

        let Message = {
            "user" : IDExpediteur,
            "timeSent" : creationDate,
            "content" : message
        };

        const result = await Conversation.insertOne(
            {IDConv : idConv ,
            Messages : {[initialMessageKey] : Message},
            IDProf : IDProf,
            IDEleve : IDEleve})

        console.log("Nouvelle Conversation ajouté dans la base de données :", result);
    }

}

createConv(0,1,"Test Message 4",0,1)