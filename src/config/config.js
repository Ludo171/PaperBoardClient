const config = {
    hostname: "http://mydomain.com",

    http_port: 1245,
    rest_url: "http://mydomain.com:1245/REST",

    socket_port: 1236,
    socket_url: "ws://mydomain.com:1236/websockets/sock1",
};

// HOSTNAME
if (["dev", "develop", "development"].includes(process.env.NODE_ENV)) {
    config.hostname = process.env.REACT_APP_HOSTNAME_DEV;
    config.http_port = process.env.REACT_APP_REST_PORT_DEV;
    config.rest_url = `${process.env.REACT_APP_REST_PROTOCOL}://${process.env.REACT_APP_HOSTNAME_DEV}:${process.env.REACT_APP_REST_PORT_DEV}`;
    config.socket_port = process.env.REACT_APP_SOCKET_PORT_DEV;
    config.socket_url = `${process.env.REACT_APP_SOCKET_PROTOCOL_DEV}://${process.env.REACT_APP_HOSTNAME_DEV}:${process.env.REACT_APP_SOCKET_PORT_DEV}/${process.env.REACT_APP_SOCKET_API_DEV}`;
}
export default config;
