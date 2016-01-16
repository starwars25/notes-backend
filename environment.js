module.exports = function() {
    if(process.argv[2]) {
        switch(process.argv[2]) {
            case 'production':
                process.env.NODE_ENVIRONMENT = 'production';
                break;
            case 'test':
                process.env.NODE_ENVIRONMENT = 'test';
                break;
            default:
                process.env.NODE_ENVIRONMENT = 'development';
                break;
        }
    } else {
        process.env.NODE_ENVIRONMENT = 'development';
    }
};