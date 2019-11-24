const config = {
    hostname: "http://mydomain.com",

    http_port: 1245,
    rest_url: "http://mydomain.com:1245/REST",

    socket_port: 1236,
    socket_url: "ws://mydomain.com:1236/websockets/sock1",
};

// HOSTNAME
if (["dev", "develop", "development"].includes(process.env.REACT_APP_ENVIRONMENT)) {
    config.hostname = process.env.REACT_APP_HOSTNAME_DEV;
    config.http_port = process.env.REACT_APP_REST_PORT_DEV;
    config.rest_url = `${process.env.REACT_APP_REST_PROTOCOL_DEV}://${process.env.REACT_APP_HOSTNAME_DEV}:${process.env.REACT_APP_REST_PORT_DEV}`;
    config.socket_port = process.env.REACT_APP_SOCKET_PORT_DEV;
    config.socket_url = `${process.env.REACT_APP_SOCKET_PROTOCOL_DEV}://${process.env.REACT_APP_HOSTNAME_DEV}:${process.env.REACT_APP_SOCKET_PORT_DEV}/${process.env.REACT_APP_SOCKET_API_DEV}`;
} else if (["prod", "production"].includes(process.env.REACT_APP_ENVIRONMENT)) {
    config.hostname = process.env.REACT_APP_HOSTNAME_PROD;
    config.http_port = process.env.REACT_APP_REST_PORT_PROD; //No port specified on Heroku
    config.rest_url = `${process.env.REACT_APP_REST_PROTOCOL_PROD}://${process.env.REACT_APP_HOSTNAME_PROD}`; //No port specified on Heroku
    config.socket_port = process.env.REACT_APP_SOCKET_PORT_PROD; //No port specified on Heroku
    config.socket_url = `${process.env.REACT_APP_SOCKET_PROTOCOL_PROD}://${process.env.REACT_APP_HOSTNAME_PROD}/${process.env.REACT_APP_SOCKET_API_PROD}`; //No port specified on Heroku
}
console.log(process.env.REACT_APP_ENVIRONMENT);
console.log('Here is the config');
console.log(config);
export default config;
