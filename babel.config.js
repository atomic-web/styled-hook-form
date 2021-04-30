module.exports = function (api) {
    api.cache(true);

    return {
        "presets": [
            [
                "@babel/preset-env",
                {
                    "useBuiltIns": "entry",
                    "corejs": "3"
                }
            ],
            ["@babel/preset-react",{
                "runtime": "automatic"
            }],
            "@babel/preset-typescript"
        ],
        "plugins": [
            "babel-plugin-styled-components"
        ]
    }
}