const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin")

module.exports = {
    mode: "production",
    devtool: false,
    plugins: [
        new ModuleFederationPlugin({
            name: "module_b",
            filename: "remoteEntry.js",
            library: { type: "var", name: "module_b" },
            remotes: {
                host: "host@/remoteEntry.js",
            },
            exposes: {
                "./Message": "./src/index",
            },
        }),
    ],
}
