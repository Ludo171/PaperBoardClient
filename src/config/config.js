const config = {
    hostname: "http://mydomain.com",
    http_port: 1245,
    socket_port: 1236,
};

// HOSTNAME
if (["dev", "develop", "development"].includes(process.env.NODE_ENV)) {
    config.hostname = process.env.REACT_APP_HOSTNAME_DEV;
    config.http_port = process.env.REACT_APP_HTTP_PORT_DEV;
    config.socket_port = process.env.REACT_APP_SOCKET_PORT_DEV;
}

export default config;
