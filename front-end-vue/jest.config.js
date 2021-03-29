module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
    transform: {
        '^.+\\.vue$': 'vue-jest'
    },
    transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!primevue/.*)"
    ]
}
