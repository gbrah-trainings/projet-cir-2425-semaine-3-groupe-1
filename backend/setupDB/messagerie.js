import {client} from './connectDB.mjs';
export {createConv, getConv,getAllConvByID};

async function createConv(IDExpediteur,message, IDProf, IDEleve){
    const db = client.db("conversations");
    const Conversation = db.collection("conversations");

    let creationDate = new Date();

    //console.log(await Conversation.countDocuments());
    let idConv = await Conversation.countDocuments();

    let existingConversation = await Conversation.findOne({IDProf : IDProf, IDEleve : IDEleve});

    let existingConversation2 = await Conversation.findOne({IDProf : IDEleve, IDEleve : IDProf});

    if(existingConversation || existingConversation2){
        if(existingConversation2){
            existingConversation = existingConversation2;
        }
        var messageCount = Object.keys(existingConversation.Messages).length;

        let NewMessage = (({
            "id" : messageCount,
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
            "id" : 0,
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

//createConv(0,"Test Message 3",0,1)

async function getConv(idConv,parameters){
    const db = client.db("conversations");
    const Conversation = db.collection("conversations");

    const ActualConv = await Conversation.findOne({IDConv : idConv});

    if(ActualConv){
        if(ActualConv.hasOwnProperty(parameters)){
            return ActualConv[parameters];
        }
    }
}

async function getAllConvByID(userID){
    const db = client.db("conversations");
    const Conversation = db.collection("conversations");

    const ActualConv = await Conversation.find({IDEleve : userID});
    const ActualConv2 = await Conversation.find({IDProf : userID});

    if(ActualConv){
        return ActualConv;
    }
    else if(ActualConv2){
        return ActualConv2;
    }
}

//let result = await getConvIDs(0,"IDEleve");
//console.log(result);

let result = await getAllConvByID(1);
console.log(result);