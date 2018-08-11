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
    });

    /**
     * logout button
     */
    logoutButton.on('click', function() {
        const $this = $(this);

        $this.attr('disabled', '');
        loginButton.removeAttr('disabled');
    });

};





