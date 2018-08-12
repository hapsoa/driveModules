const eventManager = new function () {

    const that = this;

    const loginButton = $('button#login');
    const logoutButton = $('button#logout');

    const $loginedUserZone = $('.loginedUser-zone');

    /**
     * login button
     */
    loginButton.on('click', function () {
        const $this = $(this);

        $this.attr('disabled', '');
        logoutButton.removeAttr('disabled');

        FirebaseApi.signIn();

    });


    /**
     * logout button
     */
    logoutButton.on('click', function () {
        const $this = $(this);

        $this.attr('disabled', '');
        loginButton.removeAttr('disabled');

        FirebaseApi.signOut();
    });


    /**
     * onAuthStateChanged Listener
     */
    let loginTemplate;

    FirebaseApi.setOnAuthStateChanged(function (user) {
        console.log(user);
        let $loginedUser = $('.loginedUser');

        if (!_.isNil(user)) { // 로그인 상태라면
            // 화면에 유저 이름을 보여준다.
            loginTemplate = `<div class="loginedUser">${user.displayName}</div>`;
            $loginedUserZone.append(loginTemplate);
        }
        else { // 로그아웃 할 때
            // const $loginTemplate = $(loginTemplate);
            // console.log($loginTemplate.text());
            // $loginedUserZone.find($loginTemplate).remove();

            $loginedUserZone.find($loginedUser).remove();
        }

        /**
         * 유저 이름을 클릭시,
         * 해당 유저가 가지고 있는 파일 정보들을 보여준다.
         */
        $loginedUser = $('.loginedUser');

        $loginedUser.on('click', function () {
            console.log('ohohoh!');
        });

    });


    /**
     * file submit button
     */
    const $submitButton = $('button#submitFile');
    const $fileInput = $('input[type="file"]');

    $submitButton.on('click', async function () {

        const selectedFile = document.getElementById('inputs').files[0];

        console.log(selectedFile.name);

        await that.sendStroage(selectedFile);
    });


    /**
     * 1. 저장소에 파일을 보내고,
     * 2. 로딩 과정을 보여준다
     */
    this.sendStroage = async function (selectedFile) {
        const currentUser = auth.currentUser;
        const fileRef = storageRef.child(`${selectedFile.name}`);

        // 1. 데이터베이스에 파일 메타데이터를 보낸다.
        FirebaseDB.writeData(currentUser, selectedFile);

        // 2. 저장소에 파일을 보내고,
        const uploadTask = fileRef.put(selectedFile);

        // 3. 로딩 과정을 보여준다
        uploadTask.on('state_changed', function (snapshot) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, function (error) {
            // Handle unsuccessful uploads
        }, function () {
            // Handle successful uploads on complete
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
            })
        });
    };



};


/**
 * Drag and Drop
 */
const dropboxManager = new function () {
    let dropbox;

    dropbox = document.getElementById("dropbox");
    dropbox.addEventListener("dragenter", dragenter, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("drop", drop, false);

    function dragenter(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function dragover(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function drop(e) {
        e.stopPropagation();
        e.preventDefault();

        const dt = e.dataTransfer;
        const files = dt.files;

        handleFiles(files);
    }

    async function handleFiles(files) {
        console.log(files[0]);
        // 여기에서 저장소로 보낸다.
        const selectedFile = files[0];


        eventManager.sendStroage(selectedFile);
    }

};























