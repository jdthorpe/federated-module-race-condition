const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin")

module.exports = function override(config, env) {
    config.output.publicPath = "auto"

    if (!config.plugins) {
        config.plugins = []
    }

    config.plugins.unshift(
        new ModuleFederationPlugin({
            name: "host",
            filename: "remoteEntry.js",
            remotes: {
                module_a: "module_a@/container/module_a/remoteEntry.js",
                module_b: "module_b@/container/module_b/remoteEntry.js",
            },
        })
    )

    return config
}
