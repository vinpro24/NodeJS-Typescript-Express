module.exports = {
    roots: ['<rootDir>/src/'],
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleNameMapper: {
        '~/(.*)': '<rootDir>/src/$1'
    }
}
