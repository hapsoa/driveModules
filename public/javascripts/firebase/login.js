const eventManager = new function() {

    const loginButton = $('button#login');
    const logoutButton = $('button#logout');

    /**
     * login button
     */
    loginButton.on('click', function() {
        const $this = $(this);

        $this.attr('disabled', '');
        logoutButton.removeAttr('disabled');

        FirebaseApi.signIn();

    });


    /**
     * logout button
     */
    logoutButton.on('click', function() {
        const $this = $(this);

        $this.attr('disabled', '');
        loginButton.removeAttr('disabled');

        FirebaseApi.signOut();
    });

    FirebaseApi.setOnAuthStateChanged(function(user) {
         console.log(user);
    });


    /**
     * file submit
     */
    const $submitButton = $('button#submitFile');
    const $fileInput = $('input[type="file"]');

    $submitButton.on('click', async function() {

        const selectedFile = document.getElementById('inputs').files[0];

        console.log(selectedFile.name);

        const fileRef = storageRef.child(`${selectedFile.name}`);

        await fileRef.put(selectedFile);
    });

    $fileInput.on('change', function() {

    });
};





