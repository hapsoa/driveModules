const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const store = firebase.firestore(); // 데이터베이스
const storage = firebase.storage(); // 저장소
const storageRef = storage.ref();

const imagesRef = storageRef.child('images');
const mountainImagesRef = storageRef.child('images/lotus2.jpg');


const FirebaseDB = {
    createUser: async (user) => {
        const data = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: new Date().getTime(),
            signAt: new Date().getTime(),
            files: []
        };

        return await store.collection('users').doc(user.uid).set(data);
    },

    signUser: async (user) => {
        const data = {
            displayNadisplayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            signAt: new Date().getTime()
        };

        return await store.collection('users').doc(user.uid).update(data);
    },

    readUser: async (uid) => {
        // 데이터가 어디에 있다 라고 위치 설정만 하는것
        const refUser = store.collection('users').doc(uid);
        const doc = await refUser.get();
        if (doc.exists)
            return doc.data();
        else
            return null;
    },

    writeData: async (currentUser, file) => {
        console.log(file);
        const data = {
            user: currentUser.uid,
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            name: file.name,
            size: file.size,
            type: file.type,
            webkitRelativePath: file.webkitRelativePath
        };

        console.log(currentUser);
        // const arr =currentUser.files;
        // arr.push(file.name);

        return await store.collection('files').doc(file.name).set(data);
    }
};

const FirebaseApi = new function() {

    let listener = null;

    function setOnAuthStateChanged(callback) {
        listener = callback;
    }

    auth.onAuthStateChanged(async (user) => {
        if(_.isNil(user)) {
            if (!_.isNil(listener)) listener(null);
            return;
        }

        let u = await FirebaseDB.readUser(user.uid);
        if (_.isNil(u)) {
            await FirebaseDB.createUser(user);
            u = await FirebaseDB.readUser(user.uid);
        }
        else {
            await FirebaseDB.signUser(user);
            u = await FirebaseDB.readUser(user.uid);
        }

        if (!_.isNil(listener))
            listener(u);
    });

    return {
        signIn: async () => await auth.signInWithPopup(provider),
        signOut: async() => await auth.signOut(),
        setOnAuthStateChanged
    };

};





















