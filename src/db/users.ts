import DataStore from "nedb";

const db  = new DataStore('./db/users');
db.loadDatabase();

export const create = async (username:string, password:string) => {
    const {
        error, document
    } = await getUser(username);
    if (error) {
        return false;
    }
    if (document){
        return false;
    }
    db.insert({
        username,
        password
    });
    return true;
}

export const getUser = (username: string) => {
    return new Promise<{error: Error | null, document: any | null}>((res) => {
        db.findOne({
            username
        }, (err, doc) => {
            res({
                error: err,
                document: doc,
            })
        })
    });
}